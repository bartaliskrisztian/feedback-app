import {useState} from "react";
import { Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Topic from "./components/Topic";
import ReportPage from "./components/ReportPage";

function App() {

  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  const onSearch = (e) => {
    setSearchText(e.target.value);
  }

  return (
    <div className="App">
      <Layout>
          <Route exact path="/login" render={() => <Login setUser={setUser} />} />
          <Route exact path="/" render={() => {
            return (
              <div>
                <Navbar user={user} setUser={setUser} onSearch={onSearch} />
                <Home user={user} setUser={setUser} searchText={searchText} />
              </div>
            );
          }} />
          <Route path="/topic/:userId/:topicId" render={()=> {
            return (
              <div>
                <Navbar user={user} setUser={setUser} />
                <Topic />
              </div>
            );
          }} />
          <Route exact path="/report/:userId/:topicId" component={ReportPage}/>
      </Layout>
    </div>
  );
}

export default App;
