# SimpleCalculator

**SimpleCalculator** is a lightweight web‑based calculator that runs entirely in the browser. It provides a clean, responsive UI and supports both mouse/touch interaction and full keyboard shortcuts.

---

## Tech Stack
- **HTML** – Structure of the calculator UI.
- **CSS** – Styling and responsive layout.
- **JavaScript** – Core arithmetic logic, UI binding, keyboard support, and error handling.

---

## Features
- **Basic arithmetic** – Addition, subtraction, multiplication, and division.
- **Clear (C) and Delete (←)** – Reset the calculator or delete the last entered digit.
- **Keyboard shortcuts** – Use the keyboard for all operations (see table below).
- **Error handling** – Division by zero displays a user‑friendly error message.
- **Formatted display** – Numbers are shown with commas for easier reading.
- **Responsive design** – Works on desktops, tablets, and mobile phones.
- **No dependencies** – Pure client‑side implementation, no build step required.

---

## Installation / Usage
1. Clone or download the repository.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari, etc.).
3. The calculator is ready to use – click the buttons or use the keyboard.

> **Note:** Because the app is pure HTML/JS/CSS, it can also be hosted on any static web server.

---

## File Overview
| File | Description |
|------|-------------|
| `index.html` | The HTML markup that defines the calculator layout and includes the stylesheet and script. |
| `styles.css` | CSS rules for styling the calculator, handling the grid layout, visual states, and responsive breakpoints. |
| `script.js` | Implements the `Calculator` class (core logic) and UI binding, including click handling and keyboard support. |
| `README.md` | This documentation file – provides an overview, usage instructions, and contribution guidelines. |

---

## Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `0‑9` | Append the corresponding digit to the current operand |
| `.` | Append a decimal point (only one per number) |
| `+` | Set addition operation |
| `-` | Set subtraction operation |
| `*` | Set multiplication operation |
| `/` | Set division operation |
| `Enter` or `=` | Compute the result |
| `Backspace` | Delete the last character of the current operand |
| `Delete` or `Escape` | Clear the calculator (reset all state) |

---

## Error Handling
- Attempting to divide by **zero** throws an error in the core logic. The UI catches this error and displays a temporary message like `Error: Division by zero`. After a short delay (2 seconds) the display returns to the last valid value.

---

## Responsive Design
The calculator layout uses CSS Grid and media queries to adapt to different screen sizes:
- **Desktop:** Standard grid with all buttons visible.
- **Tablet:** Buttons scale down while maintaining a comfortable tap area.
- **Mobile:** Full‑width layout with larger touch targets.

*Screenshots* (replace with actual images when available):

![Desktop view](./screenshots/desktop.png)
![Mobile view](./screenshots/mobile.png)

---

## Contribution Guidelines (optional)
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Make your changes, ensuring the existing functionality is not broken.
4. Test the UI in multiple browsers and screen sizes.
5. Submit a pull request with a clear description of the changes.

---

## License
This project is open‑source and available under the MIT License.
