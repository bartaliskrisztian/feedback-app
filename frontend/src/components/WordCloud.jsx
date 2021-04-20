import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import { withNamespaces } from "react-i18next";
import { apiPostRequest } from "../api/utils";

import "../assets/css/WordCloud.css";
import "react-toastify/dist/ReactToastify.css";

function WordCloud({ t, props }) {
  const [wordCloudLoaded, setWordCloudLoaded] = useState(false);
  const [noWordCloudText, setNoWordCloudText] = useState("");
  const [wordCloudSource, setWordCloudSource] = useState("");

  // fetching the details of a topic before rendering
  useEffect(() => {
    createWordcloud(props.reports);
    // eslint-disable-next-line
  }, []);

  const createWordcloud = (reports) => {
    const textArray = reports.map((report) => report.text);
    const text = textArray.join("");
    if (!text.length) {
      setNoWordCloudText(t("There are no reports yet."));
      setWordCloudLoaded(true);
      return;
    }
    apiPostRequest(
      null,
      null,
      JSON.stringify({
        text: text,
      }),
      "topicWordCloud"
    ).then(
      (response) => {
        let data = response.result.slice(2);
        data = data.slice(0, -1);
        const wordCloudBase64 = `data:image/jpg;base64,${data}`;
        setWordCloudSource(wordCloudBase64);
        setWordCloudLoaded(true);
      },
      (reject) => {
        notifyError(reject);
      }
    );
  };

  const notifyError = (message) => toast.error(message);
  const WordCloud = () => (
    <img
      alt="wordcloud"
      src={wordCloudSource}
      className="word-cloud__image"
    ></img>
  );

  return (
    <div className="word-cloud">
      <div className="word-cloud__no-reports">{noWordCloudText}</div>
      {!wordCloudLoaded && (
        <div>
          <div className="wordcloud-loader"></div>
          <div>{t("Generating wordcloud")}</div>
        </div>
      )}
      {wordCloudLoaded && !noWordCloudText && <WordCloud />}
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        hideProgressBar={true}
        autoClose={3000}
        closeOnClick={false}
      />
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state) => {
  const props = {
    reports: state.currentTopicReports,
    topic: state.currentTopicDetails,
  };
  return { props };
};

export default connect(mapStateToProps)(withNamespaces()(WordCloud));
