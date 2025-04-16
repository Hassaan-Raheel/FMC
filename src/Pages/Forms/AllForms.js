import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import "./Forms.css";
import ContactTable from "../../Components/FormsComponent/ContactTable";
import NewsLetterTable from "../../Components/FormsComponent/NewsLetterTable";
import CareersTable from "../../Components/FormsComponent/CareersTable";

const AllForms = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null);

  const handleSwitchForm = (form) => {
    if (form !== selectedForm) {
      setInProp(false);
      setTimeout(() => {
        setSelectedForm(form);
        setInProp(true);
      }, 300);
    }
  };

  const renderTable = () => {
    switch (selectedForm) {
      case "Careers":
        return <CareersTable />;
      case "NewsLetter":
        return <NewsLetterTable />;
      case "Contact Us":
        return <ContactTable />;
      default:
        return null;
    }
  };

  return (
    <div className="AllFormsPage">
      <div className="FormsComponent">
        <div className="FormHandling">
          <div className="Header">All Forms</div>
          <div className="NavigationHandling">
            <div className="Sidebar-LeftContent">
              {["Careers", "NewsLetter", "Contact Us"].map((form) => (
                <div
                  key={form}
                  className={`Sidebar-Element ${selectedForm === form ? "active" : ""}`}
                  onClick={() => handleSwitchForm(form)}
                >
                  {form}
                </div>
              ))}
            </div>
            <div className="Sidebar-RightContent">
              <CSSTransition
                in={inProp && selectedForm !== null} 
                timeout={300}
                classNames="fade"
                unmountOnExit
                nodeRef={nodeRef} 
                onExited={() => setInProp(true)} 
              >
                <div ref={nodeRef} className="Data-Content">
                  {renderTable()}
                </div>
              </CSSTransition>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllForms;