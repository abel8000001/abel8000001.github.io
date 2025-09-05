import './App.css'
import Background from './components/Background';
import TaskBarWrapper from './components/TaskBarWrapper'
import Desktop from './components/Desktop';

{/* @ts-expect-error library works even if it's not fully compatible with ts*/ }
import '@react95/core/GlobalStyle';
import '@react95/core/themes/win95.css';

function App() {
  return (
    <>
      <Background />
      <Desktop />
      <TaskBarWrapper />
    </>
  )
}

export default App
