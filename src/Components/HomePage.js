import React, { useState, useEffect } from "react";

const HomePage = () => {
  const [score, setScore] = useState(null);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    fetch("https://pro-792c7-default-rtdb.firebaseio.com/stream.json")
      .then((res) => res.json())
      .then((data) => {
        setTweets([[data['text'], calculateSince(data['created_at']), data['senti_val']],...tweets]);//subject to change
        console.log("set tweet; ", data["text"]);
      });
  },[]);

  useEffect(() => {
    fetch("/dominoScore")
      .then((res) => res.json())
      .then((data) => {
        console.log("set score state: ", data.toString());
        setScore(data.toString())
        console.log("stored score state: ", data);
      });
  },[]);


  function calculateSince(datetime)
  {
      var tTime=new Date(datetime);
      var cTime=new Date();
      var sinceMin=Math.round((cTime-tTime)/60000);
      if(sinceMin===0)
      {
          var sinceSec=Math.round((cTime-tTime)/1000);
          if(sinceSec<10)
            var since ='less than 10 seconds ago';
          else if(sinceSec<20)
            var since ='less than 20 seconds ago';
          else
            var since ='half a minute ago';
      }
      else if(sinceMin===1)
      {
          var sinceSec=Math.round((cTime-tTime)/1000);
          if(sinceSec==30)
            var since='half a minute ago';
          else if(sinceSec<60)
            var since='less than a minute ago';
          else
            var since='1 minute ago';
      }
      else if(sinceMin<45)
          var since=sinceMin+' minutes ago';
      else if(sinceMin>44&&sinceMin<60)
          var since='about 1 hour ago';
      else if(sinceMin<1440){
          var sinceHr=Math.round(sinceMin/60);
          if(sinceHr===1)
            var since='about 1 hour ago';
          else
            var since='about '+sinceHr+' hours ago';
      }
      else if(sinceMin>1439&&sinceMin<2880)
          var since='1 day ago';
      else
      {
          var sinceDay=Math.round(sinceMin/1440);
          var since=sinceDay+' days ago';
      }
      return since;
  };

  const tweetList = tweets.map( tweet => {
    return (
      <a class="list-group-item list-group-item-action flex-column align-items-start ">
      <div class="d-flex w-100 justify-content-between">
         {tweet[2] >= 0 ? (<h5 class="mb-1">Sentiment: Positive</h5>) : (<h5 class="mb-1">Sentiment: Negative</h5>)}
        <small>{tweet[1]}</small>
      </div>
      <p class="mb-1">
        {tweet[0]}
      </p>
    </a>

    )
  }
  )

  return (
    <div>
      <header class="masthead bg-primary text-white text-center">
        <div class="container d-flex align-items-center flex-column">
          <img
            class="masthead-avatar mb-5"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Dominos_pizza_logo.svg/1200px-Dominos_pizza_logo.svg.png"
            alt="dominos_logo"
          />

          <div>
            <h1 class="masthead-heading text-uppercase mb-0">
              {!score && <div><i class="fas fa-sync fa-spin"></i></div>}
              {score ? score  : null}/5
            </h1>
          </div>

          <h3>Sentiment Score</h3>

          <div class="divider-custom divider-light">
            <div class="divider-custom-icon">
              {score === 1 ? <i class="fas fa-star"></i> : null}
              {score === 2 ? (
                <div>
                  {" "}
                  <i class="fas fa-star"></i> <i class="fas fa-star"></i>
                </div>
              ) : null}
              {score === 3 ? (
                <div>
                  {" "}
                  <i class="fas fa-star"></i> <i class="fas fa-star"></i>{" "}
                  <i class="fas fa-star"></i>
                </div>
              ) : null}
              {score === 4 ? (
                <div>
                  {" "}
                  <i class="fas fa-star"></i> <i class="fas fa-star"></i>{" "}
                  <i class="fas fa-star"></i> <i class="fas fa-star"></i>
                </div>
              ) : null}
              {score === 5 ? (
                <div>
                  {" "}
                  <i class="fas fa-star"></i> <i class="fas fa-star"></i>{" "}
                  <i class="fas fa-star"></i> <i class="fas fa-star"></i>{" "}
                  <i class="fas fa-star"></i>
                </div>
              ) : null}
            </div>
          </div>

          <p class="masthead-subheading font-weight-light mb-0">
            {" "}
            Based on tweets that contains @dominos for the past week,
            generating in real-time
          </p>
        </div>
      </header>
      <div class="page-section-half"></div>
      
      <div class="container d-flex align-items-center flex-column">
      {tweets.length !== 0 && <h3>Latest Tweets that Contains @Dominos</h3>}
      <div class = "page-section-little"></div>
            {tweetList}
      </div>
      <div class="page-section-half"></div>
    </div>
    
  );
};

export default HomePage;
