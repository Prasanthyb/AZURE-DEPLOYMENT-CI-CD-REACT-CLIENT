import React, { useState } from 'react';

const ApiKey = "51732afeaeba4f48964f8a32f8c318c0";
const AzureEndpoint = "https://mission.cognitiveservices.azure.com/";

function App() {
  const [data, setData] = useState();
  const [image, setImage] = useState('');
  const [displayMsg, setDisplayMsg] = useState(' ');

  const handleOnChange = (e) => {
    setImage(e.target.value);
  };

  const onButtonClick = async (e) => {
    if (image.trim() === '') {
      alert('Please enter an image URL.');
    } else if (
      !image ||
      !(
        image.endsWith('.jpg') ||
        image.endsWith('.jpeg') ||
        image.endsWith('.png') ||
        image.endsWith('.webp')
      )
    ) {
      setImage('');
      setDisplayMsg('Invalid image format or URL');
    } else {
      setData();
      setDisplayMsg('Loading...');
      try {
        const fetchOptions = {
          method: 'POST',
          timeout: 50000,
          headers: {
            'Ocp-Apim-Subscription-Key': ApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: image,
          }),
        };

        const response = await fetch(
          `${AzureEndpoint}computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=tags,caption`,
          fetchOptions,
        );

        const parsedData = await response.json();
        setData(parsedData);

        console.log(parsedData.modelVersion);
        console.log(parsedData.captionResult.text);
        console.log(parsedData.metadata.width);
        console.log(parsedData.metadata.height);
      } catch (error) {
        console.error('There is an error during fetch:', error);
        setDisplayMsg('Sorry, there was an error.');
      }
    }
  };

  return (
    <div>
      <div className="container">
        <div>
          <div className="header">
            <h1 style={{ backgroundColor: 'red', fontSize: '48px', color: 'black', padding: '8px', display: 'block' }}>
              Welcome to Turners Car Auctions
            </h1>
            <h3
              style={{
                backgroundColor: 'lightgreen',
                fontSize: '18px',
                color: 'blue',
                fontStyle: 'italic',
                padding: '8px',
                display: 'block',
              }}
            >
              Don't Dream It, Drive It!
            </h3>
          </div>
        </div>

        <div>
          <div className="input-section">
            <label
              htmlFor="imageInput"
              style={{
                backgroundColor: 'orange',
                fontSize: '18px',
                color: 'black',
                padding: '8px',
                display: 'block',
              }}
            >
              Enter the image URL of your favorite car
            </label>

            <input
              id="imageInput"
              className="inputbox"
              placeholder="Please enter the image URL...."
              value={image}
              onChange={handleOnChange}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                fontSize: '16px',
                outline: 'none',
              }}
            />
            <button className="button" onClick={onButtonClick}>
              Click Here
            </button>
          </div>
        </div>

        <section className="result-section">
          {image && <img src={image} width={320} height={180} alt={image} />}
          <p className="textclass">{data && data.captionResult.text}</p>

          {data &&
            data.tagsResult &&
            data.tagsResult.values.some((item) => item.name === 'car') ? (
              <ul>
                {data.tagsResult.values.map((item) => (
                  <li key={item.name}>
                    <span>
                      {item.name} - Confidence level {parseInt(item.confidence * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div>{displayMsg && <p>{displayMsg}</p>}</div>
            )}
        </section>
      </div>
    </div>
  );
}

export default App;
