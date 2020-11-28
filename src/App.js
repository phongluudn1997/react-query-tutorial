import * as React from "react";
import "./App.css";
import { useQuery, queryCache } from "react-query";
import axios from "axios";
import { ReactQueryDevtools } from "react-query-devtools";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

function Posts() {
  const { data: posts, isLoading } = useQuery("posts", () =>
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.data)
  );
  console.log("RENDER");
  return isLoading ? (
    "Loading..."
  ) : (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link to={`/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}

function Post() {
  const { postId } = useParams();
  const { data: post, isLoading, isFetching } = useQuery(
    ["post", postId],
    () =>
      axios
        .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        .then(res => res.data),
    {
      initialData: () => {
        console.log(postId);
        return queryCache
          .getQueryData("posts")
          ?.find(post => post.id === Number(postId));
      },
      initialStale: true,
    }
  );
  if (isLoading) {
    return "Loading...";
  }
  return (
    <>
      <h1>Hello post {post.title}</h1>
      <Link to="/">Back</Link>
      <div>{isFetching && "Fetching.."}</div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/:postId">
            <Post />
          </Route>
          <Route path="/">
            <Posts />
          </Route>
        </Switch>
      </Router>
      <ReactQueryDevtools />
    </div>
  );
}

export default App;
