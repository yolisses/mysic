import NotesEditor from "./components/NotesEditor"
import { NotesContextProvider } from "./contexts/NotesContext";

function App() {
  return (
    <NotesContextProvider>
      <div>
        <NotesEditor></NotesEditor>
      </div>
    </NotesContextProvider>
  );
}

export default App;
