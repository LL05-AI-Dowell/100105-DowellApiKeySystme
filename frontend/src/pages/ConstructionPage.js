import "./ConstructionPage.css";
import DowellLogo from "../dowellLogo.png";
import Stop from "./stop.svg"


const ConstructionPage = ({ hideLogo, message }) => {
  return (
    <div className="construction__Page__Container">
      {hideLogo ? <></> : <img src={DowellLogo} alt="dowell logo" />}
      <img className = "construction__Page__Container__image" src={Stop} alt="Stop" />
      <div>
        <h1 className="title">
          {message ? message : "Attention!"}
        </h1>
        <p className="description">
          DoWell services will be activated if DoWell renews the contract; kindly speak to HR. We apologize for any inconvenience caused.
        </p>
      </div>
    </div>
  );
};

export default ConstructionPage;
