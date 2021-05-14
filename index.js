import React, { Component } from 'react';
import { render } from 'react-dom';
import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

function HackerNewsPosts({ posts, comments, getcommentsFromId }) {
  if (posts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div class="comments_maindiv">
      <h2>Top 10 HackerNews Stories</h2>
      <ul>
        {posts.map(post => (
          <li
            className="collapse-li"
            onClick={() => getcommentsFromId(post.id)}
            key={post.id}
            id={post.id}
          >
            <button class="btn btn-primary btn-block" href={post.url}>
              {post.title}
            </button>
            {comments.length > 0 ? (
              <div class="comments_inner">
                {comments.map(comment => (
                  <li key={comment.id}>
                    {comment.text ? <p>{comment.text.trim()}</p> : null}
                  </li>
                ))}
              </div>
            ) : null}
          </li>
        ))}
        {/* {comments.map(comment => (
          <li key={comment.id}>
            <p>{comment.text}</p>
          </li>
        ))} */}
      </ul>
    </div>
  );
}

function App() {
  const [posts, setPosts] = React.useState([]);
  const [comments, setComments] = React.useState([]);

  React.useEffect(() => {
    async function getTopStories() {
      const url = 'https://hacker-news.firebaseio.com/v0/topstories.json';
      try {
        const response = await fetch(url);
        if (response.ok === false) {
          throw new Error('Response Error:' + response.text);
        }
        const json = await response.json();
        const promises = json
          .slice(0, 10)
          .map(id =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
              response => response.json()
            )
          );
        const result = await Promise.all(promises);
        var kidss = result[0].kids;
        const map1 = kidss.map(x =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${x}.json`).then(
            response => response.json()
          )
        );
        const resultNew = await Promise.all(map1);
        console.log('sfdsdf', resultNew);
        setPosts(result);
        // setComments(resultNew);
      } catch (err) {
        console.error(err);
      }
    }
    getTopStories();
  }, []);

  async function getcommentsFromId(id) {
    //alert('ssfsdf' + id);
    if ($('#' + id).hasClass('active')) {
      $('li').removeClass('active');
      return false;
    }
    $('li').removeClass('active');
    $('#' + id).addClass('active');
    const json = [id];
    const promises = json.map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
        response => response.json()
      )
    );
    const result = await Promise.all(promises);
    var kidss = result[0].kids;
    const map1 = kidss
      .slice(0, 20)
      .map(x =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${x}.json`).then(
          response => response.json()
        )
      );
    const resultNew = await Promise.all(map1);
    console.log('sfdsdf', resultNew);
    setComments(resultNew);
  }

  return (
    <div className="App">
      <HackerNewsPosts
        posts={posts}
        comments={comments}
        getcommentsFromId={getcommentsFromId.bind(this)}
      />
    </div>
  );
}

// const rootElement = document.getElementById('root');
// ReactDOM.render(<App />, rootElement);

render(<App />, document.getElementById('app'));

// Getting props from component
// function Demo(props) {
//   return <div>
//     <h3>{props.message}</h3>
//   </div>;
// }
