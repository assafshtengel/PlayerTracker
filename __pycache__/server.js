const express = require('express');
const path = require('path');
const app = express();

// הגשת קבצים סטטיים מתוך תיקיית public
app.use(express.static(path.join(__dirname, 'public')));

// ראוט בסיסי
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public','index.html'));
});

// ניתן להרחיב מאוחר יותר ראוטים ל-API, התחברות, ניהול משחקים, וכו'.

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
});
