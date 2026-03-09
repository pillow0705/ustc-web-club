# JavaScript 基础语法指南

## 1. 变量和常量

### 声明变量
```javascript
// var - 旧方式，作用域为函数级别（不推荐使用）
var name = 'John';

// let - 推荐使用，作用域为块级别（ES6）
let age = 25;

// const - 声明常量，不可重新赋值
const PI = 3.14159;
```

### 变量命名规则
- 必须以字母、下划线 `_` 或 `$` 开头
- 可以包含数字，但不能作为首字符
- 区分大小写：`age` 和 `Age` 是不同的变量
- 推荐使用驼峰命名法：`userName`, `isLoggedIn`

---

## 2. 数据类型

JavaScript 有两类数据类型：**原始类型** 和 **对象类型**

### 原始类型（Primitive）
```javascript
// 字符串
const str = 'Hello World';
const str2 = "JavaScript";
const str3 = `模板字符串，支持变量：${str}`;

// 数字（整数和浮点数）
const integer = 42;
const float = 3.14;
const negative = -10;

// 布尔值
const isTrue = true;
const isFalse = false;

// null 和 undefined
const empty = null;        // 主动赋值为空
let notAssigned;           // undefined（未赋值）

// Symbol（ES6）- 唯一的标识符
const id = Symbol('userId');

// BigInt - 超大整数
const bigNumber = 9007199254740991n;
```

### 对象类型
```javascript
// 对象（Object）
const person = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com'
};

// 数组（Array） - 特殊的对象
const colors = ['red', 'green', 'blue'];
const numbers = [1, 2, 3, 4, 5];

// 函数（Function） - 也是对象
function greet() {
  console.log('Hello!');
}

// 日期（Date）
const now = new Date();
```

---

## 3. 运算符

### 算术运算符
```javascript
const a = 10;
const b = 3;

console.log(a + b);  // 13 - 加法
console.log(a - b);  // 7  - 减法
console.log(a * b);  // 30 - 乘法
console.log(a / b);  // 3.33... - 除法
console.log(a % b);  // 1  - 取余
console.log(a ** 2); // 100 - 幂运算（ES7）
```

### 赋值运算符
```javascript
let x = 10;
x += 5;  // x = x + 5，结果为 15
x -= 3;  // x = x - 3，结果为 12
x *= 2;  // x = x * 2，结果为 24
x /= 4;  // x = x / 4，结果为 6
```

### 比较运算符
```javascript
console.log(5 > 3);      // true  - 大于
console.log(5 < 3);      // false - 小于
console.log(5 >= 5);     // true  - 大于等于
console.log(5 <= 3);     // false - 小于等于
console.log(5 == '5');   // true  - 值相等（类型转换）
console.log(5 === '5');  // false - 值和类型都相等
console.log(5 != '5');   // false - 值不相等
console.log(5 !== '5');  // true  - 值或类型不相等
```

### 逻辑运算符
```javascript
const x = true;
const y = false;

console.log(x && y);  // false - AND 逻辑与（两个都为 true 才是 true）
console.log(x || y);  // true  - OR 逻辑或（至少一个为 true 就是 true）
console.log(!x);      // false - NOT 逻辑非（取反）
```

---

## 4. 条件语句

### if-else 语句
```javascript
const age = 18;

if (age < 13) {
  console.log('儿童');
} else if (age < 18) {
  console.log('青少年');
} else {
  console.log('成人');
}
```

### switch 语句
```javascript
const day = 'Monday';

switch (day) {
  case 'Monday':
    console.log('星期一');
    break; // 重要：不加 break 会继续执行下一个 case
  case 'Tuesday':
    console.log('星期二');
    break;
  default:
    console.log('其他日期');
}
```

### 三元运算符
```javascript
const age = 20;
const status = age >= 18 ? '成人' : '未成年';
console.log(status); // 输出：成人
```

---

## 5. 循环语句

### for 循环
```javascript
// 基本 for 循环
for (let i = 0; i < 5; i++) {
  console.log(i); // 输出 0, 1, 2, 3, 4
}

// 遍历数组
const fruits = ['apple', 'banana', 'orange'];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
```

### while 循环
```javascript
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
```

### for-of 循环（ES6）
```javascript
const numbers = [10, 20, 30];
for (const num of numbers) {
  console.log(num); // 输出 10, 20, 30
}
```

### for-in 循环
```javascript
const person = { name: 'Alice', age: 30, city: 'Beijing' };
for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}
```

### forEach 方法
```javascript
const colors = ['red', 'green', 'blue'];
colors.forEach((color, index) => {
  console.log(`${index}: ${color}`);
});
```

---

## 6. 函数

### 函数声明
```javascript
// 命名函数
function add(a, b) {
  return a + b;
}

console.log(add(5, 3)); // 输出 8
```

### 函数表达式
```javascript
const multiply = function(a, b) {
  return a * b;
};

console.log(multiply(5, 3)); // 输出 15
```

### 箭头函数（ES6）
```javascript
// 最常用的现代写法
const square = (x) => {
  return x * x;
};

// 简写形式（单行可省略花括号）
const double = (x) => x * 2;

// 无参数
const greet = () => 'Hello!';

console.log(square(5));  // 输出 25
console.log(double(5));  // 输出 10
console.log(greet());    // 输出 Hello!
```

### 函数参数
```javascript
// 默认参数
function greetUser(name = 'Guest') {
  console.log(`Hello, ${name}!`);
}

greetUser();        // 输出 Hello, Guest!
greetUser('Alice'); // 输出 Hello, Alice!

// 剩余参数
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 输出 10
```

---

## 7. 对象和数组

### 对象操作
```javascript
// 创建对象
const user = {
  name: 'John',
  age: 25,
  email: 'john@example.com',
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

// 访问属性
console.log(user.name);        // John
console.log(user['email']);    // john@example.com

// 修改属性
user.age = 26;

// 添加新属性
user.city = 'Beijing';

// 删除属性
delete user.city;

// 调用方法
user.greet(); // 输出 Hello, I'm John
```

### 数组操作
```javascript
const numbers = [1, 2, 3, 4, 5];

// 访问元素
console.log(numbers[0]);       // 1

// 数组长度
console.log(numbers.length);   // 5

// 常用数组方法
numbers.push(6);               // 添加元素到末尾
numbers.pop();                 // 删除末尾元素
numbers.shift();               // 删除首个元素
numbers.unshift(0);            // 添加元素到开头

// 数组遍历和转换
const doubled = numbers.map(num => num * 2);    // [0, 2, 4, 6, 8, 10]
const even = numbers.filter(num => num % 2 === 0); // [0, 2, 4]
const total = numbers.reduce((sum, num) => sum + num, 0); // 求和

console.log(doubled); // [0, 2, 4, 6, 8, 10]
console.log(even);    // [0, 2, 4]
console.log(total);   // 15
```

---

## 8. 字符串操作

```javascript
const str = 'Hello World';

// 字符串长度
console.log(str.length); // 11

// 获取字符
console.log(str[0]);          // H
console.log(str.charAt(0));   // H

// 查找子字符串
console.log(str.indexOf('World'));  // 6
console.log(str.includes('Hello')); // true

// 提取子字符串
console.log(str.substring(0, 5));   // Hello
console.log(str.slice(0, 5));       // Hello

// 转换大小写
console.log(str.toLowerCase());     // hello world
console.log(str.toUpperCase());     // HELLO WORLD

// 替换
console.log(str.replace('World', 'JavaScript')); // Hello JavaScript

// 分割
const words = str.split(' '); // ['Hello', 'World']

// 连接（trim 去除两端空格）
const padded = '  Hello  ';
console.log(padded.trim()); // Hello
```

---

## 9. 异步编程

### 回调函数（Callback）
```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback('Data loaded');
  }, 1000);
}

fetchData((data) => {
  console.log(data); // 1 秒后输出：Data loaded
});
```

### Promise（ES6）
```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
    // 或 reject('Error!');
  }, 1000);
});

promise
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
```

### async/await（ES8）- 最推荐使用
```javascript
async function loadData() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log('Error:', error);
  }
}

loadData();
```

---

## 10. 模块化

### 导出和导入（ES6 Module）

**userApi.js**
```javascript
// 导出函数
export function getUser(id) {
  return { id, name: 'John' };
}

// 导出对象
export const config = { apiUrl: 'http://api.example.com' };

// 默认导出
export default function greet() {
  console.log('Hello!');
}
```

**main.js**
```javascript
// 导入具名导出
import { getUser, config } from './userApi.js';

// 导入默认导出
import greet from './userApi.js';

// 导入所有内容
import * as api from './userApi.js';

console.log(getUser(1));   // { id: 1, name: 'John' }
console.log(config);       // { apiUrl: '...' }
greet();                   // Hello!
```

---

## 11. 常见的代码模式

### 对象解构
```javascript
const person = { name: 'Alice', age: 30, city: 'Beijing' };

// 解构赋值
const { name, age } = person;
console.log(name); // Alice
console.log(age);  // 30

// 重命名
const { name: userName, age: userAge } = person;
```

### 数组解构
```javascript
const colors = ['red', 'green', 'blue'];

// 解构赋值
const [first, second, third] = colors;
console.log(first); // red

// 跳过元素
const [, , color] = colors;
console.log(color); // blue
```

### 扩展运算符
```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// 合并数组
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 复制对象
const original = { a: 1, b: 2 };
const copy = { ...original, c: 3 }; // { a: 1, b: 2, c: 3 }
```

---

## 12. 常见的错误和最佳实践

### 常见错误
```javascript
// ❌ 使用 == 而不是 ===（容易出现类型转换问题）
console.log(5 == '5');   // true（不安全）
console.log(5 === '5');  // false（推荐）

// ❌ 忘记 const/let，创建全局变量
x = 10; // 不推荐

// ❌ 在循环中声明变量时使用 var（作用域问题）
for (var i = 0; i < 3; i++) { }
console.log(i); // 3（意外的全局变量）

// ✅ 推荐做法
for (let j = 0; j < 3; j++) { }
console.log(j); // ReferenceError（预期的作用域限制）
```

### 最佳实践
```javascript
// ✅ 使用常量和有意义的变量名
const MAX_USERS = 100;
const userName = 'Alice';

// ✅ 使用箭头函数
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);

// ✅ 使用模板字符串
const message = `Hello, ${userName}!`;

// ✅ 进行错误处理
try {
  // 可能出错的代码
} catch (error) {
  console.error('Error:', error);
}

// ✅ 避免回调地狱，使用 async/await
async function main() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

---

## 总结

这个指南涵盖了 JavaScript 的主要语法特性。在实际开发中：

1. **优先使用 ES6+ 特性**（let/const、箭头函数、async/await）
2. **使用 === 而不是 ==**（避免类型强制转换）
3. **记住异步操作**（Promise、async/await）
4. **充分利用数组方法**（map、filter、reduce）
5. **编写清晰的代码**（好的变量名、合理的注释）

通过不断练习这些基础概念，你将能够编写更高效、更易维护的 JavaScript 代码。
