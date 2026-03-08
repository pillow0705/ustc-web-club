"""Deploy USTC Web Club to remote server."""
import paramiko
import os
import stat

HOST = '43.167.242.196'
USER = 'root'
PASSWORD = 'Cvyvhv666'
REMOTE_DIR = '/root/program/ustc-web-club'
LOCAL_DIR = os.path.dirname(os.path.abspath(__file__))

EXCLUDE = {'node_modules', 'package-lock.json', '.git', 'dist', 'club.db', 'deploy.py', '__pycache__'}

def ssh_exec(ssh, cmd):
    print(f'  >> {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=120)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out.strip():
        print(out.strip())
    if err.strip():
        print(err.strip())
    return out, err

def upload_dir(sftp, local_path, remote_path):
    for item in os.listdir(local_path):
        if item in EXCLUDE:
            continue
        local_item = os.path.join(local_path, item)
        remote_item = remote_path + '/' + item
        if os.path.isdir(local_item):
            try:
                sftp.stat(remote_item)
            except FileNotFoundError:
                sftp.mkdir(remote_item)
            upload_dir(sftp, local_item, remote_item)
        else:
            print(f'  Uploading: {remote_item}')
            sftp.put(local_item, remote_item)

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    print(f'Connecting to {HOST}...')
    ssh.connect(HOST, username=USER, password=PASSWORD, timeout=15)
    print('Connected!\n')

    sftp = ssh.open_sftp()

    # 1. Create remote directory
    print('=== Creating remote directory ===')
    ssh_exec(ssh, f'mkdir -p {REMOTE_DIR}/backend {REMOTE_DIR}/frontend')

    # 2. Upload files
    print('\n=== Uploading backend ===')
    upload_dir(sftp, os.path.join(LOCAL_DIR, 'backend'), REMOTE_DIR + '/backend')

    print('\n=== Uploading frontend ===')
    upload_dir(sftp, os.path.join(LOCAL_DIR, 'frontend'), REMOTE_DIR + '/frontend')

    print('\n=== Uploading project docs ===')
    for f in os.listdir(LOCAL_DIR):
        fpath = os.path.join(LOCAL_DIR, f)
        if os.path.isfile(fpath) and f not in EXCLUDE:
            print(f'  Uploading: {REMOTE_DIR}/{f}')
            sftp.put(fpath, f'{REMOTE_DIR}/{f}')

    sftp.close()

    # 3. Install dependencies & build
    print('\n=== Checking Node.js ===')
    ssh_exec(ssh, 'node -v || echo "NODE_NOT_FOUND"')

    print('\n=== Remove node_modules for cross-platform compatibility ===')
    ssh_exec(ssh, f'cd {REMOTE_DIR}/backend && rm -rf node_modules package-lock.json')

    print('\n=== Installing backend dependencies ===')
    ssh_exec(ssh, f'cd {REMOTE_DIR}/backend && npm install --production')

    print('\n=== Installing frontend dependencies & building ===')
    ssh_exec(ssh, f'cd {REMOTE_DIR}/frontend && npm install && npm run build')

    # 4. Update backend port to 5200
    print('\n=== Configuring port 5200 ===')
    ssh_exec(ssh, f"sed -i 's/PORT=3000/PORT=5200/' {REMOTE_DIR}/backend/.env")
    ssh_exec(ssh, f"cat {REMOTE_DIR}/backend/.env")

    # 5. Kill old process if running
    print('\n=== Starting server ===')
    ssh_exec(ssh, "pkill -f 'node.*ustc-web-club' || true")

    # 6. Start with nohup
    ssh_exec(ssh, f'cd {REMOTE_DIR}/backend && nohup node app.js > server.log 2>&1 & echo "Server started"')

    # Verify
    import time
    time.sleep(2)
    ssh_exec(ssh, 'curl -s http://localhost:5200/api/health')

    print(f'\n=== Deployment complete! ===')
    print(f'Backend API: http://{HOST}:5200/api/health')
    print(f'Frontend dist built at: {REMOTE_DIR}/frontend/dist/')
    print(f'Configure Nginx to serve frontend and proxy /api to port 5200')

    ssh.close()

if __name__ == '__main__':
    main()
