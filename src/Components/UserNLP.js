import React, { useState, useEffect } from "react";


const UserNLP = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [step1Completed, setStep1Completed] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [step2Completed, setStep2Completed] = useState(null);
  const [userScore, setUserScore] = useState(null);
  const [step3Completed, setStep3Completed] = useState(true)
  

  useEffect(
      () => {
      setStep3Completed(true);
    },[userScore]);

  const handleSubmitFile = (e) => {
    e.preventDefault();
    console.log('uploaded',selectedFile);
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      setSelectedFile(e.target.result);
    };
  };

  const handleCompleteStep1 = (e) => {
    e.preventDefault();
    setStep1Completed(true);
    console.log("step1 complete",selectedFile)
  };

  //functions for step2
  function getMeta(url) {
    const img = new Image();
    img.addEventListener("load", function () {
      alert(
        "The size of the uploaded image is " +
          this.naturalWidth +
          " X " +
          this.naturalHeight
      );
    });
    img.src = url;
  }

  function memorySizeOf(obj) {
    var bytes = 0;
    function sizeOf(obj) {
      if (obj !== null && obj !== undefined) {
        // eslint-disable-next-line default-case
        switch (typeof obj) {
          case "number":
            bytes += 8;
            break;
          case "string":
            bytes += obj.length * 2;
            break;
          case "boolean":
            bytes += 4;
            break;
          case "object":
            var objClass = Object.prototype.toString.call(obj).slice(8, -1);
            if (objClass === "Object" || objClass === "Array") {
              for (var key in obj) {
                if (!obj.hasOwnProperty(key)) continue;
                sizeOf(obj[key]);
              }
            } else bytes += obj.toString().length * 2;
            break;
        }
      }
      return bytes;
    }

    function formatByteSize(bytes) {
      if (bytes < 1024) return bytes + " bytes";
      else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
      else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
      else return (bytes / 1073741824).toFixed(3) + " GiB";
    }

    return formatByteSize(sizeOf(obj));
  }

  const handleReadMetaData = (e) => {
    e.preventDefault();
    console.log(selectedFile);
    const JSONfile = JSON.parse(selectedFile);
    const firstline = JSONfile[0];
    //extracting attributes
    const attributes = 1;
    const filesize = memorySizeOf(selectedFile);

    //setting output hashmap
    const output = new Map();
    output.set(
      "firstFiveLines",
      JSON.stringify({"0":JSONfile[0],"1":JSONfile[1], "2":JSONfile[2],"3":JSONfile[3], "4":JSONfile[4]},null,'\t')
    );
    output.set("numOfAttributes", attributes);
    output.set("numOfRows", Object.keys(JSONfile).length);
    output.set("filesize", filesize);
    setMetadata(output);

    console.log('metadata', metadata);
    setStep2Completed(true);
  };

  //functions for step 3

  const handleGetScore = (e) => {
    e.preventDefault();
    setStep3Completed(false);
    fetch('/getUserScore',{
        method: 'POST',
        body: selectedFile
      }).then(
        res => res.json()
      ).then(
        data => {
          console.log('User Score: ', data);
          setUserScore(parseFloat(data["score"]))
        })   
  };

  return (
    <div>
      <header class="masthead bg-primary text-white text-center">
        <section class="page-section portfolio" id="portfolio">
          <div class="container">
            <div>
              <h2 class="page-section-heading text-center text-uppercase mb-0">
                Check Sentiment with Your Own Data
              </h2>
            </div>

            <div class="divider-custom page-section">
              <div class="divider-custom-line"></div>
              <div class="divider-custom-icon">
                <h3>Step 1 : Upload Your Data</h3>
              </div>
              <div class="divider-custom-line"></div>
            </div>
            <div class="text-center mt-4 center-block">
              <input
                type="file"
                class="justify-content-center"
                onChange={handleSubmitFile}
              />
              <button onClick={handleCompleteStep1} class="btn btn-secondary ">
                {" "}
                <i class="fas fa-upload me-2"></i>Upload
              </button>
            </div>
            {step1Completed && (
              <div class="text-center mt-4 center-block">
                <i
                  class="fas fa-check-circle fa-2x"
                  style={{ color: "#A52A2A" }}
                ></i>{" "}
                <p style={{ color: "#A52A2A" }}>Completed</p>
              </div>
            )}


            <div class="divider-custom page-section">
              <div class="divider-custom-line"></div>
              <div class="divider-custom-icon">
                <h3>Step 2 : Feature Extraction</h3>
              </div>
              <div class="divider-custom-line"></div>
            </div>
            <div class="divider-custom text-center mt-4 center-block">
              <button
                onClick={handleReadMetaData}
                type="button"
                class="btn btn-secondary"
              >
                <i class="fas fa-database me-2"></i> Conduct Feature Extraction
              </button>
            </div>
            <div class="divider-custom">
              <p>
                Number of Attributes :{" "}
                {step2Completed && metadata.get("numOfAttributes")}
              </p>
            </div>
            <div class="divider-custom">
              <p>
                Number of Rows : {step2Completed && metadata.get("numOfRows")}
              </p>
            </div>
            <div class="divider-custom">
              <p> File Size : {step2Completed && metadata.get("filesize")}</p>
              
            </div>

            <p> Data Preview :</p>
            <div class="divider-custom">
            <pre id="json">{step2Completed && metadata.get("firstFiveLines")}</pre>
            </div>
            <p> Image Size : </p>
            <div class="divider-custom">
              {step2Completed && getMeta('')}
                    <input class="form-control" onChange={(e)=> setImgUrl(e.target.value)} type="text" placeholder=" Enter an image url and a popup message will show up !"/>
                    <input class="btn btn-secondary" onClick={()=> getMeta(imgUrl)} value="Submit" />
            </div>
            {step2Completed && (
              <div class="text-center mt-4 center-block">
                <i
                  class="fas fa-check-circle fa-2x"
                  style={{ color: "#A52A2A" }}
                ></i>{" "}
                <p style={{ color: "#A52A2A" }}>Completed</p>
              </div>
            )}


            <div class="divider-custom page-section">
              <div class="divider-custom-line"></div>
              <div class="divider-custom-icon">
                <h3>Step 3 : Get sentiment from your Twitter Data! </h3>
              </div>
              <div class="divider-custom-line"></div>
            </div>
            <div class="divider-custom row justify-content-center">
              <div class="divider-custom text-center mt-4 center-block">
                <button
                  onClick={handleGetScore}
                  type="button"
                  class="btn btn-secondary"
                >
                  <i class="fas fa-rocket me-2"></i> Get Result
                </button>
              </div>
            </div>
            <div class="divider-custom">
              <p> 
                Sentiment from your Tweets :
                { step3Completed === false && <div><i class="fas fa-sync fa-spin"></i></div> } 
                { typeof userScore !== undefined &&  <h1>{userScore}/5</h1>}
                
              </p>
            </div>
          </div>
        </section>
      </header>
    </div>
  );
};

export default UserNLP;
