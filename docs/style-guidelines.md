# FreshCart Style Guidelines

## CSS Modules Approach

For consistent styling across the application, we follow these guidelines:

### Component Styling

1. **Use CSS Modules**: Each component should have its own CSS module file named `ComponentName.module.css` in the same directory as the component.

   ```
   src/
     components/
       Button/
         Button.jsx
         Button.module.css
   ```

2. **No Inline Styles**: Avoid using inline styles like `style={{color: 'red'}}`. Instead, define all styles in the component's CSS module.

3. **Class Naming**: Use camelCase for class names in CSS modules.

   ```css
   /* Good */
   .buttonPrimary { ... }
   
   /* Avoid */
   .button-primary { ... }
   ```

4. **Import and Use**: Import the CSS module in the component file and use it with the className prop.

   ```jsx
   import styles from './Button.module.css';
   
   function Button() {
     return <button className={styles.buttonPrimary}>Click me</button>;
   }
   ```

5. **Combining Classes**: When combining Bootstrap classes with module classes, use template literals.

   ```jsx
   <button className={`btn ${styles.buttonPrimary}`}>Click me</button>
   ```

### Global Styles

1. For truly global styles, use the `src/index.css` file.
2. For theme variables (colors, spacing, etc.), consider creating a `src/styles/variables.css` file that can be imported into other CSS files.

### Colors and Typography

1. Use semantic color names in your CSS modules, not literal color values.
2. Keep a consistent color palette throughout the application.
3. Use standard spacing and sizing units (rem is preferred).

### Responsive Design

1. Use Bootstrap's responsive grid system where possible.
2. For component-specific responsive behavior, use media queries in the component's CSS module.

## Example

```jsx
// Button.jsx
import styles from './Button.module.css';

export function Button({ children, variant = 'primary' }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}
```

```css
/* Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: bold;
}

.primary {
  background-color: #2ecc71;
  color: white;
}

.secondary {
  background-color: #3498db;
  color: white;
}
``` 