import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./components/home/HomePage";
import CreatePost from "./components/posts/CreatePost";
import PostsList from "./components/posts/PostsList";
import UpdatePost from "./components/posts/UpdatePost";
import Container from "./components/shared/Container";

import "./App.css";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsList />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts/:postId" element={<UpdatePost />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
