import React, { useState, useEffect } from 'react';
import defaultQuestions from './assets/questions.json';

// Simple default study notes for reference
const defaultNotes = {
  "Java": [
    { "title": "Object-Oriented Programming (OOPs)", "content": "OOPs is a paradigm based on 'objects'. The 4 pillars are:\n1. **Inheritance**: subclass inherits fields/methods of superclass.\n2. **Encapsulation**: wrapping variables and code into a single unit (private variables + public getters/setters).\n3. **Polymorphism**: ability to take many forms. Compile-time (Method Overloading) and Runtime (Method Overriding).\n4. **Abstraction**: hiding implementation details and showing only functionality (Abstract Classes and Interfaces)." },
    { "title": "Method Overloading vs Overriding", "content": "- **Overloading**: Same method name, different parameters (compile-time, same class).\n- **Overriding**: Same method name, same parameters, child overrides parent implementation (runtime, inheritance required)." },
    { "title": "Java memory management", "content": "Java utilizes automatic Garbage Collection (GC) to free heap memory. JVM divides memory into Stack (local variables, call frames) and Heap (dynamic objects, instances). Stack is fast; Heap is garbage collected." }
  ],
  "Python": [
    { "title": "Variables and Dynamic Typing", "content": "Python is dynamically typed; variables are names bound to objects at runtime. Variable names are case-sensitive. Underscores are used for private class variables (e.g., `_var` or `__private`)." },
    { "title": "List Comprehensions", "content": "A concise way to create lists. Syntax: `[expression for item in iterable if condition]`. Example: `[x**2 for x in range(10) if x % 2 == 0]` creates a list of squares of even numbers." },
    { "title": "Pandas DataFrames", "content": "Pandas is a labeled data structures library. `Series` is 1-dimensional, and `DataFrame` is a 2-dimensional tabular structure (rows and columns). Use `.iloc[]` for integer-location indexing and `.loc[]` for labels." }
  ],
  "SQL & DBMS": [
    { "title": "Database Normalization", "content": "Process of organizing data to reduce redundancy and improve data integrity.\n- **1NF**: Atomic values, no repeating groups.\n- **2NF**: In 1NF + all non-key attributes fully dependent on primary key (no partial dependency).\n- **3NF**: In 2NF + no transitive dependency.\n- **BCNF**: Strictly stronger than 3NF. Every determinant must be a candidate key." },
    { "title": "ACID Properties", "content": "Guarantees database transaction reliability:\n- **Atomicity**: Entire transaction succeeds or fails completely.\n- **Consistency**: Database goes from one valid state to another.\n- **Isolation**: Concurrent transactions don't interfere.\n- **Durability**: Completed transactions survive crashes." }
  ],
  "Big Data": [
    { "title": "Hadoop & HDFS Architecture", "content": "Hadoop Distributed File System (HDFS) uses a Master/Slave architecture:\n- **NameNode (Master)**: Manages metadata, directory tree, block locations.\n- **DataNodes (Slaves)**: Store actual data blocks, perform read/write requests.\nData blocks are replicated (default: 3) to prevent data loss." },
    { "title": "MapReduce Lifecycle", "content": "1. **Input Split**: Data is chunked.\n2. **Map**: Emits (key, value) pairs.\n3. **Shuffle & Sort**: Groups values by key.\n4. **Reduce**: Aggregates grouped values.\n5. **Output**: Writes result back to HDFS." }
  ],
  "Cloud Computing": [
    { "title": "Cloud Service Models", "content": "- **IaaS (Infrastructure as a Service)**: Provides virtual servers, storage, networking (e.g., AWS EC2, Azure VM).\n- **PaaS (Platform as a Service)**: Provides runtime environment and databases for development (e.g., Heroku, Google App Engine).\n- **SaaS (Software as a Service)**: Fully functional end-user software over web (e.g., Gmail, Google Drive, Salesforce)." },
    { "title": "Virtualization", "content": "The core technology of cloud computing. A Hypervisor (Type 1: Bare Metal, Type 2: Hosted) abstracts physical hardware into multiple Virtual Machines (VMs), allowing shared resources." }
  ],
  "Linux Programming": [
    { "title": "File Permissions", "content": "Linux files have Read (r=4), Write (w=2), and Execute (x=1) permissions for User (u), Group (g), and Others (o). Set permissions using `chmod`. Example: `chmod 755 script.sh` sets rwx for User and rx for Group/Others." },
    { "title": "Basic Commands", "content": "- `ls -la`: list files with detailed permissions.\n- `ps aux | grep`: search active system processes.\n- `kill -9 <PID>`: force terminate a process.\n- `chmod`: modify file permissions." }
  ],
  "Statistics & Analytics": [
    { "title": "Hypothesis Testing", "content": "Statistical test to make decisions using experimental data:\n- **Null Hypothesis (H0)**: No effect or relationship.\n- **Alternative Hypothesis (H1)**: An effect/difference exists.\n- **P-value**: Probability of obtaining results as extreme as the observed results assuming H0 is true. If p-value < alpha (usually 0.05), reject H0." },
    { "title": "Measures of Dispersion", "content": "Describe how spread out the data points are. Includes Range, Variance (mean squared deviation), Standard Deviation (square root of variance), and Interquartile Range (IQR)." }
  ],
  "Machine Learning": [
    { "title": "Supervised Learning Algorithms", "content": "- **KNN (K-Nearest Neighbors)**: Instance-based classifier that assigns label based on majority vote of K closest neighbors.\n- **SVM (Support Vector Machine)**: Finds optimal hyperplane that maximizes margin between classes.\n- **Decision Trees**: Hierarchical tree dividing dataset into branches based on feature values." },
    { "title": "Bias-Variance Tradeoff", "content": "- **High Bias (Underfitting)**: Model is too simple, performs poorly on training and testing data.\n- **High Variance (Overfitting)**: Model is overly complex, fits noise in training data, generalizes poorly to testing data." }
  ],
  "Data Visualization": [
    { "title": "Exploratory Data Analysis (EDA)", "content": "Visualizing data to spot patterns, detect outliers, formulate hypotheses, and check assumptions before formal modeling. Typical plots include histograms (distribution), scatter plots (correlation), and box plots (outliers)." },
    { "title": "Box Plot Anatomy", "content": "A box plot represents:\n- Median (line inside the box)\n- IQR (Interquartile Range, length of the box, Q3 - Q1)\n- Whiskers (1.5 * IQR from quartiles)\n- Outliers (points beyond whiskers)" }
  ]
};

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // login, dashboard, practice, notes, admin
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [customNotes, setCustomNotes] = useState([]);
  
  // Quiz State
  const [quizConfig, setQuizConfig] = useState({ subject: 'Java', topic: 'All Topics', mode: 'practice', limit: 10 });
  const [activeQuiz, setActiveQuiz] = useState(null);
  
  // Admin panel filter
  const [adminUsers, setAdminUsers] = useState([]);
  
  // Theme State
  const [theme, setTheme] = useState('dark');

  // Gemini API Key State
  const [apiKey, setApiKey] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  function applyTheme(t) {
    const rootEl = document.documentElement;
    const bodyEl = document.body;
    if (rootEl && bodyEl) {
      if (t === 'light') {
        rootEl.classList.add('light-mode');
        bodyEl.classList.add('light-mode');
      } else {
        rootEl.classList.remove('light-mode');
        bodyEl.classList.remove('light-mode');
      }
    }
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };

  // Load default data and local storage
  useEffect(() => {
    // Ingest default questions, add local storage additions if they exist
    const localQuestions = localStorage.getItem('custom_questions');
    let loadedQuestions = [...defaultQuestions];
    if (localQuestions) {
      loadedQuestions = [...loadedQuestions, ...JSON.parse(localQuestions)];
    }
    setQuestions(loadedQuestions);
    
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
    
    // Load Gemini API Key
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    setApiKey(savedKey);
    
    // Check if user is logged in already
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setPage('dashboard');
      loadUserData(parsedUser.email);
    }
  }, []);

  const loadUserData = (email) => {
    // Load test history
    const historyKey = `attempts_${email}`;
    const savedAttempts = localStorage.getItem(historyKey);
    if (savedAttempts) {
      setAttempts(JSON.parse(savedAttempts));
    } else {
      setAttempts([]);
    }
    
    // Load custom notes
    const notesKey = `notes_${email}`;
    const savedNotes = localStorage.getItem(notesKey);
    if (savedNotes) {
      setCustomNotes(JSON.parse(savedNotes));
    } else {
      setCustomNotes([]);
    }

    // If admin, load all users
    if (email === 'admin@preparena.com') {
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      // Inject some mock statistics for registered users if none exist
      setAdminUsers(registeredUsers);
    }
  };

  const handleLogin = (email, password) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    
    // Default admin account
    if (email === 'admin@preparena.com' && password === 'admin123') {
      const adminObj = { email, role: 'admin' };
      setUser(adminObj);
      localStorage.setItem('current_user', JSON.stringify(adminObj));
      loadUserData(email);
      setPage('dashboard');
      return true;
    }
    
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userObj = { email, role: 'student' };
      setUser(userObj);
      localStorage.setItem('current_user', JSON.stringify(userObj));
      loadUserData(email);
      setPage('dashboard');
      return true;
    }
    return false;
  };

  const handleRegister = (email, password) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    
    if (email === 'admin@preparena.com') return false; // Reserved
    if (registeredUsers.some(u => u.email === email)) return false; // Already exists
    
    const newUser = { email, password, registeredAt: new Date().toISOString() };
    registeredUsers.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
    
    const userObj = { email, role: 'student' };
    setUser(userObj);
    localStorage.setItem('current_user', JSON.stringify(userObj));
    loadUserData(email);
    setPage('dashboard');
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setUser(null);
    setPage('login');
    setActiveQuiz(null);
  };

  // Triggered when submitting a quiz attempt
  const saveQuizAttempt = (subject, score, total, timeSpent, details) => {
    const newAttempt = {
      id: `attempt_${Date.now()}`,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      subject,
      score,
      total,
      timeSpent,
      details // [{ qId, userAns, correctAns, isCorrect, topic }]
    };
    
    const updatedAttempts = [newAttempt, ...attempts];
    setAttempts(updatedAttempts);
    localStorage.setItem(`attempts_${user.email}`, JSON.stringify(updatedAttempts));
    
    // Update admin stats if needed
    if (user.role === 'student') {
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const userIdx = registeredUsers.findIndex(u => u.email === user.email);
      if (userIdx !== -1) {
        // Calculate average accuracy
        const totalScore = updatedAttempts.reduce((sum, a) => sum + a.score, 0);
        const totalQs = updatedAttempts.reduce((sum, a) => sum + a.total, 0);
        registeredUsers[userIdx].avgAccuracy = totalQs > 0 ? Math.round((totalScore / totalQs) * 100) : 0;
        registeredUsers[userIdx].quizzesTaken = updatedAttempts.length;
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {user ? (
        <Navbar 
          user={user} 
          activePage={page} 
          setPage={setPage} 
          handleLogout={handleLogout} 
          quizInProgress={!!activeQuiz}
          theme={theme}
          toggleTheme={toggleTheme}
          setSettingsOpen={setSettingsOpen}
        />
      ) : (
        <nav className="glass-panel" style={{ 
          margin: '16px 24px 8px 24px', 
          padding: '16px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '8px', 
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.2rem',
              color: '#fff',
              fontFamily: 'var(--font-title)'
            }}>N</div>
            <span style={{ 
              fontFamily: 'var(--font-title)', 
              fontWeight: '800', 
              fontSize: '1.4rem', 
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)'
            }}>Nexus Arena</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setSettingsOpen(true)}
              style={{
                background: 'var(--panel-bg)',
                border: '1px solid var(--panel-border)',
                padding: '8px 12px',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.85rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              ⚙️ Settings
            </button>
            <button 
              onClick={toggleTheme}
              style={{
                background: 'var(--panel-bg)',
                border: '1px solid var(--panel-border)',
                padding: '8px 16px',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'var(--transition-smooth)'
              }}
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </nav>
      )}
      
      <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {page === 'login' && (
          <LoginRegister onLogin={handleLogin} onRegister={handleRegister} />
        )}
        
        {page === 'dashboard' && user && (
          <Dashboard 
            attempts={attempts} 
            questions={questions} 
            setPage={setPage} 
            setQuizConfig={setQuizConfig}
            apiKey={apiKey}
          />
        )}
        
        {page === 'practice' && user && (
          <MCQPortal 
            questions={questions} 
            config={quizConfig} 
            setConfig={setQuizConfig}
            activeQuiz={activeQuiz}
            setActiveQuiz={setActiveQuiz}
            saveAttempt={saveQuizAttempt}
            setPage={setPage}
            apiKey={apiKey}
          />
        )}
        
        {page === 'notes' && user && (
          <NotesSection 
            customNotes={customNotes} 
            setCustomNotes={setCustomNotes} 
            userEmail={user.email} 
          />
        )}
        
        {page === 'admin' && user && user.role === 'admin' && (
          <AdminPanel 
            questions={questions} 
            setQuestions={setQuestions} 
            users={adminUsers} 
          />
        )}
      </main>
      
      <Footer />

      {settingsOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel animate-scale" style={{ padding: '32px', maxWidth: '500px', width: '90%' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Gemini AI Settings</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
              Unlock AI-powered features like dynamic mock test generation and the smart study advisor. Get a free API key from the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-purple)', textDecoration: 'underline' }}>Google AI Studio</a>.
            </p>
            
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label>Gemini API Key</label>
              <input 
                type="password" 
                className="input-control" 
                placeholder="AIzaSy..." 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => setSettingsOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => {
                localStorage.setItem('gemini_api_key', apiKey);
                setSettingsOpen(false);
                alert('API Key saved successfully!');
              }}>Save Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 1. NAVBAR COMPONENT
// ==========================================
function Navbar({ user, activePage, setPage, handleLogout, quizInProgress, theme, toggleTheme, setSettingsOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <nav className="glass-panel" style={{ 
      margin: '16px 24px 8px 24px', 
      padding: '16px 24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderRadius: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => !quizInProgress && setPage('dashboard')}>
        <div style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '8px', 
          background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '1.2rem',
          color: '#fff',
          fontFamily: 'var(--font-title)'
        }}>N</div>
        <span style={{ 
          fontFamily: 'var(--font-title)', 
          fontWeight: '800', 
          fontSize: '1.4rem', 
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)'
        }}>Nexus Arena</span>
      </div>
      
      {!quizInProgress && (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span 
            onClick={() => setPage('dashboard')} 
            style={{ 
              cursor: 'pointer', 
              color: activePage === 'dashboard' ? 'var(--accent-purple)' : 'var(--text-secondary)',
              fontWeight: activePage === 'dashboard' ? '700' : '500',
              fontFamily: 'var(--font-title)',
              transition: 'var(--transition-smooth)'
            }}>Dashboard</span>
          <span 
            onClick={() => setPage('practice')} 
            style={{ 
              cursor: 'pointer', 
              color: activePage === 'practice' ? 'var(--accent-purple)' : 'var(--text-secondary)',
              fontWeight: activePage === 'practice' ? '700' : '500',
              fontFamily: 'var(--font-title)',
              transition: 'var(--transition-smooth)'
            }}>MCQs Portal</span>
          <span 
            onClick={() => setPage('notes')} 
            style={{ 
              cursor: 'pointer', 
              color: activePage === 'notes' ? 'var(--accent-purple)' : 'var(--text-secondary)',
              fontWeight: activePage === 'notes' ? '700' : '500',
              fontFamily: 'var(--font-title)',
              transition: 'var(--transition-smooth)'
            }}>Study Notes</span>
            
          {user.role === 'admin' && (
            <span 
              onClick={() => setPage('admin')} 
              style={{ 
                cursor: 'pointer', 
                color: activePage === 'admin' ? 'var(--accent-purple)' : 'var(--text-secondary)',
                fontWeight: activePage === 'admin' ? '700' : '500',
                fontFamily: 'var(--font-title)',
                transition: 'var(--transition-smooth)',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>Admin Panel</span>
          )}
          
          <button 
            onClick={() => setSettingsOpen(true)}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--panel-border)',
              padding: '6px 12px',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.8rem',
              marginRight: '8px',
              transition: 'var(--transition-smooth)'
            }}
          >
            ⚙️ Settings
          </button>
          
          <button 
            onClick={toggleTheme}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--panel-border)',
              padding: '6px 12px',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginRight: '8px',
              transition: 'var(--transition-smooth)'
            }}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--panel-border)',
                padding: '6px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: user.role === 'admin' ? 'var(--color-warning)' : 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.email.split('@')[0]}</span>
            </div>
            {dropdownOpen && (
              <div className="glass-panel animate-scale" style={{ 
                position: 'absolute', 
                right: 0, 
                top: '40px', 
                width: '150px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 100
              }}>
                <button 
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-error)',
                    padding: '8px',
                    textAlign: 'left',
                    width: '100%',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-title)',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderRadius: '6px',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
      {quizInProgress && (
        <div style={{ color: 'var(--color-warning)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="glow-purple" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-warning)', display: 'inline-block' }} />
          Exam in Progress
        </div>
      )}
    </nav>
  );
}

// ==========================================
// 2. AUTH COMPONENT
// ==========================================
function LoginRegister({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (isLogin) {
      const ok = onLogin(email, password);
      if (!ok) {
        setError('Invalid email or password.');
      }
    } else {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      const ok = onRegister(email, password);
      if (ok) {
        setSuccess('Registration successful! Logging in...');
      } else {
        setError('Email already exists or is reserved.');
      }
    }
  };

  return (
    <div className="animate-slide" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '70vh' 
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '40px',
        boxShadow: '0 8px 32px rgba(13, 11, 33, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
            {isLogin ? 'Welcome Back' : 'Get Prepared'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isLogin ? 'Sign in to practice MCQs and view your analytics.' : 'Create an account to track your study progress.'}
          </p>
        </div>
        
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: 'var(--color-error)', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px', 
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>{error}</div>
        )}
        
        {success && (
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid rgba(16, 185, 129, 0.2)', 
            color: 'var(--color-success)', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px', 
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>{success}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-control" 
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="input-group" style={{ marginBottom: '28px' }}>
            <label>Password</label>
            <input 
              type="password" 
              className="input-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '20px' }}>
            {isLogin ? 'Log In' : 'Register Account'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }} 
            style={{ color: 'var(--accent-purple)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Register' : 'Log In'}
          </span>
          {isLogin && (
            <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Tip: Admin credentials are <code style={{ color: 'var(--color-warning)' }}>admin@preparena.com</code> / <code style={{ color: 'var(--color-warning)' }}>admin123</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. DASHBOARD COMPONENT
// ==========================================
function Dashboard({ attempts, questions, setPage, setQuizConfig, apiKey }) {
  // 1. Calculate overall metrics
  const totalQuizzes = attempts.length;
  const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
  const totalQs = attempts.reduce((sum, a) => sum + a.total, 0);
  const avgAccuracy = totalQs > 0 ? Math.round((totalCorrect / totalQs) * 100) : 0;
  
  const subjectsList = [...new Set(questions.map(q => q.subject))];
  
  // 2. Performance details by subject
  const subjectStats = {};
  subjectsList.forEach(sub => {
    subjectStats[sub] = { correct: 0, total: 0, count: 0 };
  });
  attempts.forEach(a => {
    if (subjectStats[a.subject]) {
      subjectStats[a.subject].correct += a.score;
      subjectStats[a.subject].total += a.total;
      subjectStats[a.subject].count += 1;
    }
  });

  // 3. Smart Diagnostics (Focus Areas vs Strengths)
  // Calculate accuracy per subject
  const focusAreas = [];
  const strengths = [];
  
  Object.keys(subjectStats).forEach(sub => {
    const stats = subjectStats[sub];
    if (stats.total > 0) {
      const accuracy = Math.round((stats.correct / stats.total) * 100);
      if (accuracy < 60) {
        focusAreas.push({ subject: sub, accuracy, reason: `Requires improvement in base concepts. (${stats.correct}/${stats.total} correct)` });
      } else if (accuracy >= 85) {
        strengths.push({ subject: sub, accuracy, reason: `Excellent comprehension. (${stats.correct}/${stats.total} correct)` });
      }
    }
  });

  // Suggest a subject to study based on focus areas or untaken quizzes
  const suggestSubject = () => {
    // If there is an untaken subject, suggest it first
    for (let sub of subjectsList) {
      if (!subjectStats[sub] || subjectStats[sub].total === 0) {
        return { subject: sub, message: "Untried subject. Start practicing this topic to build your profile!" };
      }
    }
    // Else, return the one with the lowest score
    let lowestSub = null;
    let lowestAcc = 101;
    Object.keys(subjectStats).forEach(sub => {
      const stats = subjectStats[sub];
      if (stats.total > 0) {
        const acc = (stats.correct / stats.total) * 100;
        if (acc < lowestAcc) {
          lowestAcc = acc;
          lowestSub = sub;
        }
      }
    });
    if (lowestSub) {
      return { subject: lowestSub, message: `Your accuracy here is ${Math.round(lowestAcc)}%. Retake quizzes on this subject to improve.` };
    }
    return { subject: 'Java', message: "Start a review test to check your memory." };
  };

  const suggestion = suggestSubject();

  return (
    <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
      {/* Main Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top welcome card */}
        <div className="glass-panel" style={{ 
          padding: '32px', 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Welcome back to your Practice Arena!</h2>
            <p style={{ color: 'var(--text-secondary)', maxWIdth: '600px', fontSize: '0.95rem' }}>
              Your smart analytics are ready. Track your strengths, focus on weak subjects, and build your confidence before the final exam.
            </p>
          </div>
          <button 
            className="btn-primary glow-purple" 
            onClick={() => {
              setQuizConfig({ subject: suggestion.subject, topic: 'All Topics', mode: 'practice', limit: 10 });
              setPage('practice');
            }}
          >
            Practice: {suggestion.subject}
          </button>
        </div>
        
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Overall Accuracy</span>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0', color: avgAccuracy >= 80 ? 'var(--color-success)' : avgAccuracy >= 60 ? 'var(--color-warning)' : 'var(--color-error)' }}>
              {avgAccuracy}%
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From {totalQs} total questions practiced</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Quizzes Taken</span>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0', color: 'var(--accent-purple)' }}>
              {totalQuizzes}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complete attempts recorded</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Smart Recommendation</span>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', margin: '14px 0 8px 0', color: 'var(--accent-cyan)' }}>
              Focus on {suggestion.subject}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{suggestion.message}</p>
          </div>
        </div>
        
        {/* Subject wise stats */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '4px', height: '18px', background: 'var(--accent-cyan)', display: 'inline-block', borderRadius: '2px' }} />
            Subject-Wise Accuracy
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {subjectsList.map(sub => {
              const stats = subjectStats[sub] || { correct: 0, total: 0 };
              const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div key={sub} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 60px', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{sub}</span>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${stats.total > 0 ? acc : 0}%`, 
                      background: stats.total === 0 ? 'var(--text-muted)' : acc >= 80 ? 'var(--color-success)' : acc >= 60 ? 'var(--color-warning)' : 'var(--color-error)',
                      borderRadius: '4px',
                      transition: 'width 1s ease-out'
                    }} />
                  </div>
                  <span style={{ textAlign: 'right', fontWeight: '700', fontSize: '0.9rem', color: stats.total === 0 ? 'var(--text-muted)' : '#fff' }}>
            {stats.total > 0 ? `${acc}%` : 'N/A'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Sidebar: Diagnostics & History */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <AIStudyAdvisor attempts={attempts} apiKey={apiKey} />
        
        {/* Diagnostics Card */}
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Diagnostics Summary</h3>
          
          {/* Focus Areas */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-error)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-error)' }} />
              Focus Areas (Weaknesses)
            </span>
            {focusAreas.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No critical focus areas. Keep practicing to maintain high accuracy!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {focusAreas.map(fa => (
                  <div key={fa.subject} style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '3px solid var(--color-error)', borderRadius: '0 6px 6px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.85rem' }}>
                      <span>{fa.subject}</span>
                      <span style={{ color: 'var(--color-error)' }}>{fa.accuracy}%</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{fa.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Strengths */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-success)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)' }} />
              Key Strengths
            </span>
            {strengths.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Complete more quizzes with 85%+ score to show strengths here.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {strengths.map(st => (
                  <div key={st.subject} style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '3px solid var(--color-success)', borderRadius: '0 6px 6px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.85rem' }}>
                      <span>{st.subject}</span>
                      <span style={{ color: 'var(--color-success)' }}>{st.accuracy}%</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{st.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Attempts list */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Recent Quizzes</h3>
          {attempts.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>No tests taken yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {attempts.slice(0, 4).map(att => (
                <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{att.subject}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{att.date}</span>
                  </div>
                  <div style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    background: (att.score / att.total) >= 0.8 ? 'rgba(16, 185, 129, 0.1)' : (att.score / att.total) >= 0.6 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: (att.score / att.total) >= 0.8 ? 'var(--color-success)' : (att.score / att.total) >= 0.6 ? 'var(--color-warning)' : 'var(--color-error)',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}>
                    {att.score}/{att.total}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. MCQ PORTAL COMPONENT
// ==========================================
function MCQPortal({ questions, config, setConfig, activeQuiz, setActiveQuiz, saveAttempt, setPage, apiKey }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  
  // AI Generator Mode States
  const [useAI, setUseAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  
  // Available subjects
  const subjects = [...new Set(questions.map(q => q.subject))];
  
  // Available topics for the selected subject
  const topics = ['All Topics', ...new Set(questions.filter(q => q.subject === config.subject).map(q => q.topic).filter(Boolean))];
  
  // Filter questions for the active quiz
  const getQuizQuestions = () => {
    let filtered = questions.filter(q => q.subject === config.subject);
    if (config.topic && config.topic !== 'All Topics') {
      filtered = filtered.filter(q => q.topic === config.topic);
    }
    // Shuffle and pick limit
    return filtered.slice(0, config.limit);
  };
  
  const generateAIQuestions = async () => {
    setAiLoading(true);
    setAiError('');
    try {
      const promptText = `Generate 5 challenging, relevant exam-style multiple-choice questions for CDAC Big Data Analytics (BDA) on the subject "${config.subject}" and topic "${config.topic}".
Each question must be a multiple choice question with 4 options (A, B, C, D) and cover core conceptual points.
Ensure the topic matches exactly. Format the response STRICTLY as a raw JSON array of objects, with no markdown backticks, no \`\`\`json wraps, just the raw JSON text.
JSON Schema:
[
  {
    "question": "question text...",
    "options": ["Option A content", "Option B content", "Option C content", "Option D content"],
    "answer": 0, // integer index of correct option (0 for A, 1 for B, 2 for C, 3 for D)
    "explanation": "Detailed explanation of why this answer is correct."
  }
]`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      
      if (!response.ok) throw new Error(`API returned status ${response.status}`);
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      const parsedQs = JSON.parse(text);
      const finalQs = parsedQs.map((q, idx) => ({
        id: `ai_gen_${Date.now()}_${idx}`,
        subject: config.subject,
        topic: config.topic,
        question: q.question,
        options: q.options,
        answer: parseInt(q.answer),
        explanation: q.explanation
      }));
      
      if (finalQs.length === 0) throw new Error("No questions were generated by the model.");
      
      setActiveQuiz(finalQs);
      setSelectedAnswers({});
      setFlaggedQuestions({});
      setCurrentQIdx(0);
      setCompleted(false);
      setTimeSpent(0);
      
      if (config.mode === 'exam') {
        setTimeLeft(finalQs.length * 60);
      }
    } catch (err) {
      console.error(err);
      setAiError(`Failed to generate questions: ${err.message}. Please verify your API key or connection.`);
    } finally {
      setAiLoading(false);
    }
  };
  
  // Handle start quiz
  const handleStart = () => {
    if (useAI && apiKey) {
      generateAIQuestions();
      return;
    }
    
    const quizQs = getQuizQuestions();
    if (quizQs.length === 0) {
      alert("No questions found for this subject.");
      return;
    }
    setActiveQuiz(quizQs);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentQIdx(0);
    setCompleted(false);
    setTimeSpent(0);
    
    if (config.mode === 'exam') {
      setTimeLeft(config.limit * 60);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!activeQuiz || completed) return;
    
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
      
      if (config.mode === 'exam') {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [activeQuiz, completed]);

  const handleSelectOption = (optIndex) => {
    if (completed) return;
    
    // In practice mode, you can select only once to prevent guessing
    if (config.mode === 'practice' && selectedAnswers[currentQIdx] !== undefined) {
      return;
    }
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQIdx]: optIndex
    });
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions({
      ...flaggedQuestions,
      [currentQIdx]: !flaggedQuestions[currentQIdx]
    });
  };

  const handleSubmit = (auto = false) => {
    if (completed) return;
    
    if (!auto && Object.keys(selectedAnswers).length < activeQuiz.length) {
      if (!confirm("You have unanswered questions. Are you sure you want to submit?")) {
        return;
      }
    }
    
    setCompleted(true);
    
    // Calculate score
    let score = 0;
    const details = activeQuiz.map((q, idx) => {
      const userAns = selectedAnswers[idx];
      const isCorrect = userAns === q.answer;
      if (isCorrect) score++;
      return {
        qId: q.id,
        userAns: userAns !== undefined ? userAns : -1,
        correctAns: q.answer,
        isCorrect,
        topic: q.topic
      };
    });
    
    saveAttempt(config.subject, score, activeQuiz.length, timeSpent, details);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  if (aiLoading) {
    return (
      <div className="glass-panel animate-fade" style={{ maxWidth: '600px', margin: '40px auto', padding: '40px', textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(99, 102, 241, 0.1)',
          borderTop: '4px solid var(--accent-purple)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px auto'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Generating Questions...</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
          Gemini AI is analyzing BDA syllabus for **{config.subject} ({config.topic})** to generate a custom, high-fidelity mock test. This will take a few seconds.
        </p>
      </div>
    );
  }

  // Quiz Configuration View
  if (!activeQuiz) {
    return (
      <div className="glass-panel animate-scale" style={{ maxWidth: '600px', margin: '40px auto', padding: '40px' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '24px', textAlign: 'center', color: 'var(--text-primary)' }}>
          Configure MCQ Session
        </h2>
        
        {aiError && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: 'var(--color-error)', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px', 
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>{aiError}</div>
        )}
        
        <div className="input-group">
          <label>Select Subject</label>
          <select 
            className="input-control" 
            value={config.subject}
            onChange={(e) => setConfig({ ...config, subject: e.target.value, topic: 'All Topics' })}
            style={{ width: '100%' }}
          >
            {subjects.map(sub => (
              <option key={sub} value={sub} style={{ background: 'var(--bg-secondary)', color: '#fff' }}>{sub}</option>
            ))}
          </select>
        </div>
        
        <div className="input-group">
          <label>Select Topic</label>
          <select 
            className="input-control" 
            value={config.topic || 'All Topics'}
            onChange={(e) => setConfig({ ...config, topic: e.target.value })}
            style={{ width: '100%' }}
          >
            {topics.map(t => (
              <option key={t} value={t} style={{ background: 'var(--bg-secondary)', color: '#fff' }}>{t}</option>
            ))}
          </select>
        </div>
        
        <div className="input-group">
          <label>Session Mode</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div 
              onClick={() => setConfig({ ...config, mode: 'practice' })}
              style={{
                border: '1px solid',
                borderColor: config.mode === 'practice' ? 'var(--accent-purple)' : 'var(--panel-border)',
                background: config.mode === 'practice' ? 'rgba(139, 92, 246, 0.05)' : 'none',
                padding: '16px',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'var(--transition-smooth)'
              }}
            >
              <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>Practice</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Instant feedback & detailed explanations</p>
            </div>
            <div 
              onClick={() => setConfig({ ...config, mode: 'exam' })}
              style={{
                border: '1px solid',
                borderColor: config.mode === 'exam' ? 'var(--accent-purple)' : 'var(--panel-border)',
                background: config.mode === 'exam' ? 'rgba(139, 92, 246, 0.05)' : 'none',
                padding: '16px',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'var(--transition-smooth)'
              }}
            >
              <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>Exam</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Timed test, review answers at the end</p>
            </div>
          </div>
        </div>
        
        <div className="input-group" style={{ marginBottom: '32px' }}>
          <label>Questions Limit</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[10, 20, 50, 80].map(lim => (
              <button 
                key={lim} 
                className="btn-secondary" 
                onClick={() => setConfig({ ...config, limit: lim })}
                style={{ 
                  flex: 1, 
                  justifyContent: 'center',
                  borderColor: config.limit === lim ? 'var(--accent-purple)' : 'var(--panel-border)',
                  background: config.limit === lim ? 'rgba(139, 92, 246, 0.05)' : 'none'
                }}
                disabled={useAI}
              >{lim} Qs</button>
            ))}
          </div>
        </div>

        {apiKey && (
          <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', marginBottom: '24px' }}>
            <input 
              type="checkbox" 
              id="useAiCheckbox" 
              checked={useAI} 
              onChange={(e) => setUseAI(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="useAiCheckbox" style={{ margin: 0, cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.85rem' }}>
              ✨ Ask Gemini AI for Fresh, Dynamic MCQs
            </label>
          </div>
        )}
        
        <button className="btn-primary" onClick={handleStart} style={{ width: '100%', justifyContent: 'center' }}>
          Begin Challenge
        </button>
      </div>
    );
  }

  // Results View
  if (completed) {
    const totalScore = activeQuiz.reduce((score, q, idx) => score + (selectedAnswers[idx] === q.answer ? 1 : 0), 0);
    const percent = Math.round((totalScore / activeQuiz.length) * 100);
    
    return (
      <div className="glass-panel animate-scale" style={{ maxWidth: '850px', margin: '20px auto', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Quiz Completed</span>
          <h2 style={{ fontSize: '2.2rem', margin: '8px 0', color: 'var(--text-primary)' }}>
            Test Performance
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', margin: '24px 0' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: percent >= 80 ? 'var(--color-success)' : percent >= 60 ? 'var(--color-warning)' : 'var(--color-error)' }}>
                {totalScore} / {activeQuiz.length}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Score</span>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                {percent}%
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Accuracy</span>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff' }}>
                {formatTime(timeSpent)}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Time Taken</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button className="btn-primary" onClick={() => setActiveQuiz(null)}>Take Another Test</button>
            <button className="btn-secondary" onClick={() => { setActiveQuiz(null); setPage('dashboard'); }}>Back to Dashboard</button>
          </div>
        </div>
        
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px' }}>Review Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeQuiz.map((q, idx) => {
            const userAns = selectedAnswers[idx];
            const isCorrect = userAns === q.answer;
            return (
              <div key={idx} style={{ 
                padding: '20px', 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid',
                borderColor: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Q{idx+1}: {q.question}</h4>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: isCorrect ? 'var(--color-success)' : 'var(--color-error)',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {isCorrect ? 'Correct' : userAns === undefined ? 'Unanswered' : 'Incorrect'}
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  {q.options.map((opt, oIdx) => {
                    let borderCol = 'var(--panel-border)';
                    let bgCol = 'none';
                    let labelColor = 'var(--text-secondary)';
                    
                    if (oIdx === q.answer) {
                      borderCol = 'var(--color-success)';
                      bgCol = 'rgba(16, 185, 129, 0.05)';
                      labelColor = 'var(--color-success)';
                    } else if (oIdx === userAns) {
                      borderCol = 'var(--color-error)';
                      bgCol = 'rgba(239, 68, 68, 0.05)';
                      labelColor = 'var(--color-error)';
                    }
                    
                    return (
                      <div key={oIdx} style={{ 
                        border: '1px solid', 
                        borderColor: borderCol, 
                        background: bgCol,
                        padding: '10px 14px', 
                        borderRadius: '8px', 
                        fontSize: '0.85rem',
                        color: labelColor
                      }}>
                        <span style={{ fontWeight: '700', marginRight: '6px' }}>{String.fromCharCode(97 + oIdx).toUpperCase()}:</span> {opt}
                      </div>
                    );
                  })}
                </div>
                
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.8rem', borderLeft: '3px solid var(--accent-purple)' }}>
                  <div style={{ fontWeight: '700', color: 'var(--accent-purple)', marginBottom: '4px' }}>Explanation:</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{q.explanation}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Interactive Quiz View
  const currentQuestion = activeQuiz[currentQIdx];
  const userSelection = selectedAnswers[currentQIdx];
  const hasAnsweredCurrent = userSelection !== undefined;

  return (
    <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Question Card */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
        
        {/* Top Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Subject: {config.subject}</span>
            <h3 style={{ fontSize: '1rem', color: '#fff', marginTop: '4px' }}>Question {currentQIdx+1} of {activeQuiz.length}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {config.mode === 'exam' && (
              <div style={{ fontSize: '1rem', fontWeight: '700', color: timeLeft < 30 ? 'var(--color-error)' : '#fff' }}>
                Time: {formatTime(timeLeft)}
              </div>
            )}
            <button 
              onClick={handleToggleFlag}
              style={{
                background: flaggedQuestions[currentQIdx] ? 'rgba(245, 158, 11, 0.15)' : 'none',
                border: '1px solid',
                borderColor: flaggedQuestions[currentQIdx] ? 'var(--color-warning)' : 'var(--panel-border)',
                color: flaggedQuestions[currentQIdx] ? 'var(--color-warning)' : 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'var(--font-title)',
                fontWeight: '600',
                fontSize: '0.8rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              {flaggedQuestions[currentQIdx] ? '★ Flagged' : '☆ Flag Review'}
            </button>
          </div>
        </div>
        
        {/* Question Text */}
        <div style={{ flex: 1, marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600', lineHeight: '1.6', marginBottom: '24px', color: '#fff' }}>
            {currentQuestion.question}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQuestion.options.map((opt, oIdx) => {
              let borderCol = 'var(--panel-border)';
              let bgCol = 'none';
              
              if (config.mode === 'practice' && hasAnsweredCurrent) {
                if (oIdx === currentQuestion.answer) {
                  borderCol = 'var(--color-success)';
                  bgCol = 'rgba(16, 185, 129, 0.05)';
                } else if (oIdx === userSelection) {
                  borderCol = 'var(--color-error)';
                  bgCol = 'rgba(239, 68, 68, 0.05)';
                }
              } else {
                if (oIdx === userSelection) {
                  borderCol = 'var(--accent-purple)';
                  bgCol = 'rgba(139, 92, 246, 0.05)';
                }
              }

              return (
                <div 
                  key={oIdx} 
                  onClick={() => handleSelectOption(oIdx)}
                  style={{
                    border: '1px solid',
                    borderColor: borderCol,
                    background: bgCol,
                    padding: '16px 20px',
                    borderRadius: '10px',
                    cursor: (config.mode === 'practice' && hasAnsweredCurrent) ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'var(--transition-smooth)'
                  }}
                  className={(!hasAnsweredCurrent || config.mode === 'exam') ? 'option-hover' : ''}
                >
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    border: '2px solid',
                    borderColor: borderCol,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    color: borderCol === 'var(--panel-border)' ? 'var(--text-secondary)' : '#fff'
                  }}>
                    {String.fromCharCode(65 + oIdx)}
                  </div>
                  <span style={{ fontSize: '0.95rem' }}>{opt}</span>
                </div>
              );
            })}
          </div>
          
          {/* Practice Mode instant explanation */}
          {config.mode === 'practice' && hasAnsweredCurrent && (
            <div className="animate-fade" style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', borderLeft: '4px solid var(--accent-purple)' }}>
              <div style={{ fontWeight: '700', color: 'var(--accent-purple)', marginBottom: '6px', fontSize: '0.85rem' }}>
                {userSelection === currentQuestion.answer ? '✓ Correct Answer!' : '✗ Incorrect. Explanation:'}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
        
        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button 
            className="btn-secondary" 
            disabled={currentQIdx === 0} 
            onClick={() => setCurrentQIdx(currentQIdx - 1)}
            style={{ opacity: currentQIdx === 0 ? 0.4 : 1 }}
          >
            Previous
          </button>
          
          {currentQIdx < activeQuiz.length - 1 ? (
            <button 
              className="btn-secondary" 
              onClick={() => setCurrentQIdx(currentQIdx + 1)}
            >
              Next Question
            </button>
          ) : (
            <button className="btn-primary glow-purple" onClick={() => handleSubmit(false)}>
              Submit Exam
            </button>
          )}
        </div>
      </div>
      
      {/* Tracker Sidebar */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '16px', textAlign: 'center' }}>Navigator</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', flex: 1 }}>
          {activeQuiz.map((q, idx) => {
            const isAnswered = selectedAnswers[idx] !== undefined;
            const isFlagged = flaggedQuestions[idx];
            const isActive = idx === currentQIdx;
            
            let bgCol = 'rgba(255,255,255,0.02)';
            let borderCol = 'var(--panel-border)';
            let textCol = 'var(--text-secondary)';
            
            if (isActive) {
              borderCol = 'var(--accent-purple)';
              textCol = '#fff';
            }
            if (isAnswered) {
              bgCol = 'rgba(6, 182, 212, 0.15)';
              borderCol = 'var(--accent-cyan)';
              textCol = 'var(--accent-cyan)';
            }
            if (isFlagged) {
              bgCol = 'rgba(245, 158, 11, 0.15)';
              borderCol = 'var(--color-warning)';
              textCol = 'var(--color-warning)';
            }
            if (isActive && isAnswered) {
              borderCol = 'var(--accent-purple)';
            }
            
            return (
              <div 
                key={idx} 
                onClick={() => setCurrentQIdx(idx)}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: borderCol,
                  background: bgCol,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  color: textCol,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
        
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--panel-border)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid var(--accent-cyan)' }} />
            Answered
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--color-warning)' }} />
            Flagged Review
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. NOTES SECTION COMPONENT
// ==========================================
function NotesSection({ customNotes, setCustomNotes, userEmail }) {
  const [activeSub, setActiveSub] = useState("Java");
  const [search, setSearch] = useState("");
  
  // Custom personal note form state
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  
  const subjects = Object.keys(defaultNotes);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteContent) return;
    
    const newNote = {
      id: `note_${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: new Date().toLocaleDateString()
    };
    
    const updatedNotes = [newNote, ...customNotes];
    setCustomNotes(updatedNotes);
    localStorage.setItem(`notes_${userEmail}`, JSON.stringify(updatedNotes));
    
    setNewNoteTitle("");
    setNewNoteContent("");
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = customNotes.filter(n => n.id !== id);
    setCustomNotes(updatedNotes);
    localStorage.setItem(`notes_${userEmail}`, JSON.stringify(updatedNotes));
  };

  // Filter default notes based on search query
  const getFilteredNotes = () => {
    const list = defaultNotes[activeSub] || [];
    if (!search) return list;
    return list.filter(n => 
      n.title.toLowerCase().includes(search.toLowerCase()) || 
      n.content.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredNotes = getFilteredNotes();

  return (
    <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '250px 1fr 320px', gap: '24px' }}>
      
      {/* Left panel: Subject Tabs */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '1rem', padding: '0 8px 12px 8px', borderBottom: '1px solid var(--panel-border)', marginBottom: '8px' }}>Subjects</h3>
        {subjects.map(sub => (
          <div 
            key={sub} 
            onClick={() => setActiveSub(sub)}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              color: activeSub === sub ? '#fff' : 'var(--text-secondary)',
              background: activeSub === sub ? 'rgba(139, 92, 246, 0.1)' : 'none',
              border: '1px solid',
              borderColor: activeSub === sub ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              transition: 'var(--transition-smooth)'
            }}
          >
            {sub}
          </div>
        ))}
      </div>
      
      {/* Center panel: Notes Reader */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <input 
            type="text" 
            className="input-control" 
            placeholder="Search notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 16px' }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredNotes.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No notes found matching "{search}".
            </div>
          ) : (
            filteredNotes.map((note, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--accent-cyan)' }}>{note.title}</h3>
                <p style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.7', 
                  whiteSpace: 'pre-wrap'
                }}>{note.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Right panel: Custom Personal Study Notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Write Note Form */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>My Study Sticky Note</h3>
          <form onSubmit={handleAddNote}>
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <input 
                type="text" 
                className="input-control" 
                placeholder="Title..." 
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <textarea 
                className="input-control" 
                placeholder="Write key concepts, commands or formulas..." 
                rows="4"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.85rem', resize: 'none' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '8px 16px', fontSize: '0.85rem' }}>
              Save Sticky Note
            </button>
          </form>
        </div>
        
        {/* Sticky Notes List */}
        <div className="glass-panel" style={{ padding: '20px', flex: 1, maxHeight: '400px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Saved Sticky Notes</h3>
          {customNotes.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No personal notes saved yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {customNotes.map(note => (
                <div key={note.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--panel-border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700' }}>{note.title}</h4>
                    <span 
                      onClick={() => handleDeleteNote(note.id)}
                      style={{ color: 'var(--color-error)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}
                    >✕</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right' }}>{note.createdAt}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. ADMIN PANEL COMPONENT
// ==========================================
function AdminPanel({ questions, setQuestions, users }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("questions"); // questions, users
  
  // Add question form state
  const [subject, setSubject] = useState("Java");
  const [topic, setTopic] = useState("General");
  const [qText, setQText] = useState("");
  const [opts, setOpts] = useState(["", "", "", ""]);
  const [ans, setAns] = useState(0);
  const [exp, setExp] = useState("");

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!qText || opts.some(o => !o) || !exp) {
      alert("Please fill in all fields.");
      return;
    }
    
    const newQ = {
      id: `custom_${Date.now()}`,
      subject,
      topic,
      question: qText,
      options: [...opts],
      answer: parseInt(ans),
      explanation: exp
    };
    
    const updatedQs = [...questions, newQ];
    setQuestions(updatedQs);
    
    // Save to localStorage under custom_questions
    const customQs = JSON.parse(localStorage.getItem('custom_questions') || '[]');
    customQs.push(newQ);
    localStorage.setItem('custom_questions', JSON.stringify(customQs));
    
    // Reset form
    setQText("");
    setOpts(["", "", "", ""]);
    setExp("");
    alert("Question added successfully!");
  };

  const handleDeleteQuestion = (id) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    const updatedQs = questions.filter(q => q.id !== id);
    setQuestions(updatedQs);
    
    // Remove from custom_questions in localStorage if it was custom
    if (id.startsWith('custom_')) {
      const customQs = JSON.parse(localStorage.getItem('custom_questions') || '[]');
      const filteredCustom = customQs.filter(q => q.id !== id);
      localStorage.setItem('custom_questions', JSON.stringify(filteredCustom));
    } else {
      // Just filter locally for current session since default questions are imported from questions.json
      // (Normally in production you'd write back, but here local state is sufficient for demonstration)
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(search.toLowerCase()) || 
    q.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-panel animate-fade" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
          Admin Control Center
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ borderColor: tab === 'questions' ? 'var(--accent-purple)' : 'var(--panel-border)' }} onClick={() => setTab('questions')}>Manage Questions</button>
          <button className="btn-secondary" style={{ borderColor: tab === 'users' ? 'var(--accent-purple)' : 'var(--panel-border)' }} onClick={() => setTab('users')}>Student Progress</button>
        </div>
      </div>
      
      {tab === 'questions' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
          {/* Question List */}
          <div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <input 
                type="text" 
                className="input-control" 
                placeholder="Search questions..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, padding: '10px 16px' }}
              />
            </div>
            
            <div style={{ maxHeight: '600px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredQuestions.map((q, idx) => (
                <div key={q.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--panel-border)', borderRadius: '8px', position: 'relative' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase' }}>{q.subject} - {q.topic}</span>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '4px 0 8px 0', paddingRight: '40px' }}>{q.question}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: '600' }}>
                    Correct Answer: Option {String.fromCharCode(65 + q.answer)}
                  </div>
                  <button 
                    onClick={() => handleDeleteQuestion(q.id)}
                    style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontWeight: '700' }}
                  >Delete</button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Add Question Form */}
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Add Custom MCQ</h3>
            <form onSubmit={handleAddQuestion}>
              <div className="input-group">
                <label>Subject</label>
                <select className="input-control" value={subject} onChange={(e) => setSubject(e.target.value)}>
                  {["Java", "Python", "SQL & DBMS", "Big Data", "Cloud Computing", "Linux Programming", "Statistics & Analytics", "Machine Learning", "Data Visualization"].map(sub => (
                    <option key={sub} value={sub} style={{ background: 'var(--bg-secondary)', color: '#fff' }}>{sub}</option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label>Topic Name</label>
                <input type="text" className="input-control" placeholder="e.g. OOPs Pillars" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
              
              <div className="input-group">
                <label>Question Text</label>
                <textarea className="input-control" rows="3" placeholder="Enter the MCQ question..." value={qText} onChange={(e) => setQText(e.target.value)} />
              </div>
              
              {opts.map((opt, oIdx) => (
                <div className="input-group" key={oIdx} style={{ marginBottom: '12px' }}>
                  <label>Option {String.fromCharCode(65 + oIdx)}</label>
                  <input 
                    type="text" 
                    className="input-control" 
                    placeholder={`Option ${String.fromCharCode(65 + oIdx)} content`}
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...opts];
                      newOpts[oIdx] = e.target.value;
                      setOpts(newOpts);
                    }}
                  />
                </div>
              ))}
              
              <div className="input-group">
                <label>Correct Option</label>
                <select className="input-control" value={ans} onChange={(e) => setAns(e.target.value)}>
                  {[0, 1, 2, 3].map(oIdx => (
                    <option key={oIdx} value={oIdx} style={{ background: 'var(--bg-secondary)', color: '#fff' }}>Option {String.fromCharCode(65 + oIdx)}</option>
                  ))}
                </select>
              </div>
              
              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label>Detailed Explanation</label>
                <textarea className="input-control" rows="2" placeholder="Why is this option correct?" value={exp} onChange={(e) => setExp(e.target.value)} />
              </div>
              
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Add Question</button>
            </form>
          </div>
        </div>
      )}
      
      {tab === 'users' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--panel-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Student Email</th>
                <th style={{ padding: '12px 16px' }}>Quizzes Practiced</th>
                <th style={{ padding: '12px 16px' }}>Average Accuracy</th>
                <th style={{ padding: '12px 16px' }}>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No students registered yet.</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.email} style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-primary)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px' }}>{u.quizzesTaken || 0}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: (u.avgAccuracy || 0) >= 80 ? 'var(--color-success)' : (u.avgAccuracy || 0) >= 60 ? 'var(--color-warning)' : 'var(--color-error)' }}>
                      {u.avgAccuracy || 0}%
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{u.registeredAt ? new Date(u.registeredAt).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6.5. AI STUDY ADVISOR WIDGET
// ==========================================
function AIStudyAdvisor({ attempts, apiKey }) {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (apiKey && attempts.length > 0 && !advice) {
      fetchAdvice();
    }
  }, [apiKey, attempts]);

  const fetchAdvice = async () => {
    setLoading(true);
    setError('');
    try {
      const historyStr = attempts.slice(0, 5).map(a => `${a.subject}: ${a.score}/${a.total} (${Math.round((a.score/a.total)*100)}% accuracy)`).join(', ');
      
      const prompt = `The student is preparing for the CDAC Big Data Analytics (BDA) exam.
Their recent mock test scores are: ${historyStr || 'No tests taken yet'}.
Provide a highly targeted 3-sentence study advisory listing the most important topics they should focus on and how to study them. Keep it direct, action-oriented and use simple formatting.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) throw new Error("Could not contact Gemini");
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      setAdvice(text);
    } catch (err) {
      setError("Unable to load study strategy advice.");
    } finally {
      setLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="glass-panel" style={{ padding: '20px', background: 'var(--panel-bg)', border: '1px dashed var(--panel-border)' }}>
        <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ✨ AI Study Advisor
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Connect your Gemini API Key in Settings to get personal AI study recommendations based on your performance.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--panel-border)', background: 'var(--panel-bg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ✨ AI Study Advisor
        </h4>
        {attempts.length > 0 && !loading && (
          <button onClick={fetchAdvice} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '700' }}>Refresh</button>
        )}
      </div>
      
      {loading ? (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Analyzing performance...</p>
      ) : error ? (
        <p style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>{error}</p>
      ) : advice ? (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{advice}</p>
      ) : (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Take some mock tests to receive personalized study recommendations!</p>
      )}
    </div>
  );
}

// ==========================================
// 7. FOOTER COMPONENT
// ==========================================
function Footer() {
  return (
    <footer style={{ 
      textAlign: 'center', 
      padding: '24px', 
      color: 'var(--text-muted)', 
      fontSize: '0.8rem',
      borderTop: '1px solid var(--panel-border)',
      marginTop: '40px'
    }}>
      &copy; {new Date().getFullYear()} Nexus Arena - Built for CDAC BDA Aspirants. Self-contained local application.
    </footer>
  );
}
