# Generic

## Generics

### List of Topics in Generics (from the PDF):

1. **Introduction to Generics**

   - Basics of Generics
   - Need for Generics
   - Advantages of Generics

2. **Generic Classes**

   - Creating Generic Classes
   - Example of Generic Classes

3. **Generic Methods**

   - Defining Generic Methods
   - Using Generic Methods

4. **Type Parameters and Wildcards**

   - Understanding Type Parameters
   - Wildcards (? extends, ? super)

5. **Bounded Type Parameters**

   - Upper Bounds (extends)
   - Lower Bounds (super)

6. **Generic Interfaces**

   - Implementing Generic Interfaces
   - Examples

7. **Raw Types**

   - Understanding Raw Types
   - Limitations of Raw Types

8. **Generics and Collections**

   - Using Generics with Collections (List, Map, Set)
   - Type Safety in Collections

9. **Type Erasure**

   - Concept of Type Erasure
   - How Generics Work Internally

10. **Practical Examples**

- Common Use Cases for Generics
- Benefits of Generics in Real-World Applications

### **Introduction to Generics**
Generics are a powerful feature in Java that allows you to create classes, methods, and interfaces that work with any data type while maintaining type safety.

**Example:**
```java
List<String> list = new ArrayList<>();
list.add("Hello");
list.add("World");
```
Here, `List<String>` ensures that only `String` objects can be added to the list.

---

### **Basics of Generics**
Generics allow you to write flexible and reusable code by introducing type parameters (`T`, `E`, etc.). These parameters act as placeholders for specific types.

---

### **Need for Generics**
Before generics, Java used `Object` to store different types of data, leading to runtime errors due to incorrect casting. Generics solve this by enforcing compile-time type checks.

**Without Generics:**
```java
List list = new ArrayList();
list.add("Hello");
String value = (String) list.get(0); // Requires explicit casting
```
**With Generics:**
```java
List<String> list = new ArrayList<>();
list.add("Hello");
String value = list.get(0); // No casting needed
```

---

### **Advantages of Generics**
1. **Type Safety:** Ensures that only the specified type of objects can be added.
2. **Code Reusability:** Write generic code that works with different types.
3. **Eliminates Casting:** Reduces boilerplate code by removing the need for explicit casting.

---

### **Generic Classes**
Generic classes allow you to define a class with a type parameter.

**Creating Generic Classes:**
```java
class Box<T> {
    private T item;

    public void setItem(T item) {
        this.item = item;
    }

    public T getItem() {
        return item;
    }
}
```

**Example of Generic Classes:**
```java
Box<String> stringBox = new Box<>();
stringBox.setItem("Hello");
System.out.println(stringBox.getItem());

Box<Integer> intBox = new Box<>();
intBox.setItem(123);
System.out.println(intBox.getItem());
```

---

### **Generic Methods**
Generic methods allow you to define methods that can accept any type of parameter.

**Defining Generic Methods:**
```java
public static <T> void printArray(T[] array) {
    for (T element : array) {
        System.out.println(element);
    }
}
```

**Using Generic Methods:**
```java
String[] words = {"Hello", "World"};
Integer[] numbers = {1, 2, 3};

printArray(words);
printArray(numbers);
```

---

### **Type Parameters and Wildcards**

#### **Understanding Type Parameters**
Type parameters (`T`, `E`, `K`, `V`, etc.) are placeholders for types in generic classes or methods.
- `T` - Type
- `E` - Element
- `K` - Key
- `V` - Value

#### **Wildcards (? extends, ? super)**
Wildcards make generics more flexible by representing an unknown type.

- **`? extends T`**: Restricts the type to `T` or its subclasses (upper bound).
  ```java
  public static void processList(List<? extends Number> list) {
      for (Number num : list) {
          System.out.println(num);
      }
  }
  ```
- **`? super T`**: Restricts the type to `T` or its superclasses (lower bound).
  ```java
  public static void addNumbers(List<? super Integer> list) {
      list.add(123);
  }
  ```

---

### **Bounded Type Parameters**

#### **Upper Bounds (extends)**
Restricts a type to be a subclass of a specific class or interface.
```java
class Box<T extends Number> {
    private T item;

    public void setItem(T item) {
        this.item = item;
    }

    public T getItem() {
        return item;
    }
}
```

#### **Lower Bounds (super)**
Allows a type to be a superclass of a specified class.

---

### **Generic Interfaces**
You can also define interfaces with generics.

#### **Implementing Generic Interfaces:**
```java
interface Pair<K, V> {
    K getKey();
    V getValue();
}

class KeyValue<K, V> implements Pair<K, V> {
    private K key;
    private V value;

    public KeyValue(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return key;
    }

    public V getValue() {
        return value;
    }
}
```

**Examples:**
```java
KeyValue<Integer, String> entry = new KeyValue<>(1, "One");
System.out.println(entry.getKey() + ": " + entry.getValue());
```

---

### **Raw Types**

#### **Understanding Raw Types:**
Raw types refer to generic types without specifying a type parameter. Using raw types can lead to runtime errors.
```java
List list = new ArrayList(); // Raw type
list.add("Hello");
list.add(123); // No type checking
```

#### **Limitations of Raw Types:**
- Lack of type safety.
- More prone to runtime errors.

---

### **Generics and Collections**
Generics are commonly used with collections to ensure type safety.

#### **Using Generics with Collections (List, Map, Set):**
```java
List<String> list = new ArrayList<>();
list.add("Hello");
list.add("World");

Map<Integer, String> map = new HashMap<>();
map.put(1, "One");
map.put(2, "Two");
```

#### **Type Safety in Collections:**
Generics prevent adding incompatible types to collections.
```java
List<Integer> numbers = new ArrayList<>();
numbers.add(1);
// numbers.add("Hello"); // Compile-time error
```

---

### **Type Erasure**

#### **Concept of Type Erasure:**
At runtime, Java removes all generic type information. This process is known as type erasure.

#### **How Generics Work Internally:**
Generic types are replaced with `Object` or the upper bound during compilation.
```java
List<String> list = new ArrayList<>();
list.add("Hello");
// Internally becomes:
List list = new ArrayList();
list.add("Hello");
```

---

### **Practical Examples**

#### **Common Use Cases for Generics:**
1. Writing type-safe utility methods (e.g., `Collections.sort`).
2. Creating generic data structures (e.g., `HashMap`, `ArrayList`).

#### **Benefits of Generics in Real-World Applications:**
1. **Code Reusability:** A single generic class or method can work with any type.
2. **Compile-Time Type Checking:** Avoids runtime errors by catching issues at compile-time.
3. **Cleaner Code:** Reduces the need for explicit casting.

---

 
