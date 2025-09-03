
import './App.css'
// import { ProjectsService } from './Services/ProjectsService'

function App() {




  return (
    <>
      <button onClick={() => {
        (async () => {
          // const res = await ProjectsService.create({
          //   Title: "My FIrst Code App",
          //   Description: "My First Code App Description"
          // })
          // debugger
        })()
      }}>Yes Click Me</button >
    </>
  )
}

export default App
