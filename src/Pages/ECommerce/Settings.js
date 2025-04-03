import React from "react";
import "../Page.css";
import "./ECommerce.css";
import axios from "axios";
import { Url } from "../../Services/Api";
import DataTable from "react-data-table-component";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import SearchBar from "../../Components/UI-Controls/SearchBar/Search";
import searchIcon from "../../Assets/Images/Search Bar 20 x 20.png";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import seperator from "../../Assets/Images/Seperator.png";
// import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import CustomDropdown from "../../Components/UI-Controls/Dropdown/dropdown";
import AccordionItem from "../../Components/UI-Controls/Accordian/Accordian";
import StoreLocator from "../../Components/ECommerceComponents/StoreLocationList";
import PayMethods from "../../Components/ECommerceComponents/PaymentMethods";

const ECommerceSettings = () => {
  const navigate = useNavigate();
  const rowsPerPage = 10;
  const shippingrowsPerPage = 2;
  const [data, setData] = useState([]); /* For Setting Shipping Zones Record from an API call */
  const [states, setStates] = useState([]); /* For Setting States Record from an API call */
  const [taxGet, setTaxGet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [loadingTax, setLoadingTax] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); /* For Pagination */
  const [selectedRows, setSelectedRows] = useState(new Set()); /* Use for Selection of Table Row */
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState(tab || "Shipping"); /* Track Active Tab "Shipping or Tax */
  const [isAddZone, setIsAddZone] = useState(false); /* Track "Shipping Page" state */
  const [isModalOpen, setIsModalOpen] = useState(false); /* Track "Shipping Add Page" state */
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false); /* Track "Shipping Selection Modal" state */
  const [modals, setModals] = useState({
    isFreeShippingModalOpen: false,
    isFlatRateModalOpen: false,
    isLocalPickupModalOpen: false,
  }); /* Track "Shipping Methods Modals" state */
  const [zonename, setZoneName] = useState(""); /* Handle "Zone Name Field" in Shipping Add Form */
  const [shippingStates, setShippingStates] = useState([
    { state: "", code: "" }, /* Handle "Zone Regions Selection Array" in Shipping Add Form */
  ]);
  const [shippingMethods, setShippingMethods] = useState([
    { name: "", tax: "", cost: "", min_cost: "" },
    { name: "", tax: "", cost: "", min_cost: "" },
    { name: "", tax: "", cost: "", min_cost: "" },
  ]); /* Handle "Zone Shipping Methods Selection Array" in Shipping Add Form */
  const [taxData, setTaxData] = useState({
    taxName: "",
    description: "",
    rate: "",
  }); /* Handle Tax Add Form using Single State */
  const [taxStates, setTaxStates] = useState([
    { state: "", code: "" }, /* Handle "Zone Regions Selection Array" in Shipping Add Form */
  ]);
  const [isEditing, setIsEditing] = useState(false); /* Track if an edit operation is ongoing */
  const [zoneId, setZoneId] = useState("");
  const [taxId, setTaxId] = useState("");

  useEffect(() => {
    if (activeTab === "Shipping") {
      fetchTableData();
    } else if (activeTab === "Tax") {
      fetchTaxData();
    }
  }, [activeTab]);

  const handleChange = (e, field, index = null) => {
    const { name, value } = e.target;

    if (field === "zonename") {
      setZoneName(value);
    } else if (field === "shippingStates" && index !== null) {
      const updatedStates = [...shippingStates];
      updatedStates[index][name] = value;
      setShippingStates(updatedStates);
    } else if (field === "shippingMethods" && index !== null) {
      const updatedMethods = [...shippingMethods];
      updatedMethods[index][name] = value;
      setShippingMethods(updatedMethods);
    }
  };

  const modalIndexMap = {
    isFreeShippingModalOpen: 0,
    isFlatRateModalOpen: 1,
    isLocalPickupModalOpen: 2,
  };

  const currentModalIndex = Object.keys(modals).find(
    (key) => modals[key] === true
  );

  const index = modalIndexMap[currentModalIndex];

  const handleModalToggle = (modalKey) => {
    const updatedModals = {
      isFreeShippingModalOpen: false,
      isFlatRateModalOpen: false,
      isLocalPickupModalOpen: false,
    };

    const updatedMethods = [...shippingMethods];
    const index = modalIndexMap[modalKey];

    if (modalKey === "isFreeShippingModalOpen") {
      updatedMethods[index] = {
        ...updatedMethods[index],
        tax: "0",
        cost: "0",
      };
    }

    if (
      modalKey === "isFlatRateModalOpen" ||
      modalKey === "isLocalPickupModalOpen"
    ) {
      const method = updatedMethods[index];

      if (method.taxable === "Non Taxable") {
        updatedMethods[index] = {
          ...method,
          tax: "0",
          min_cost: "0",
        };
      } else {
        updatedMethods[index] = {
          ...method,
          min_cost: "0",
        };
      }
    }

    setShippingMethods(updatedMethods);

    setModals({ ...updatedModals, [modalKey]: true });
    setIsShippingModalOpen(false);
  };
  
  useEffect(() => {
    fetchTableData();
  }, []);

  useEffect(() => {
    fetchStatesData();
  }, []);

  useEffect(() => {
    fetchTaxData();
  }, []);

  async function fetchTaxData() {
    setLoadingTax(true);
    setTimeout(async () => {
      try {
        const response = await axios.get(`${Url}/api/v1/tax/get`);
        const reversedData = response.data.tax.reverse();
        setTaxGet(reversedData);
      } catch (error) {
        console.error("There was an error fetching the tax data:", error);
      } finally {
        setLoadingTax(false);
      }
    }, 2000);
  }

  async function fetchTableData() {
    setLoadingShipping(true);
    setTimeout(async () => {
      try {
        const URL = `${Url}/api/v1/shipping/get`;
        const response = await axios.get(URL);
        const reversedData = response.data.shippingZones.reverse();
        setData(reversedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingShipping(false);
      }
    }, 2000);
  }

  async function fetchStatesData() {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.get(
          `${Url}/api/v1/states/get`
        );
        const reversedData = response.data.states.reverse();
        setStates(reversedData);
        console.log("Response Data:", reversedData);
      } catch (error) {
        console.error("There was an error fetching the states data:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  }

  const handleSearch = () => console.log("Search has been triggered");

  const handleAddZone = () => {
    setIsAddZone(true);
  };

  const handleBackToShipping = () => {
    setIsAddZone(false);
    setIsEditing(false);
    resetForm();
  };

  const customStyles = {
    headCells: {
      style: {
        height: "52px",
        borderRadius: "4px 4px 0px 0px",
        background: 'transparent',
        opacity: "1",
        textAlign: "center",
        justifyContent: "center",
        border: "none",
        color: "var(--text-color-1)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-medium)",
        fontSize: "var(--font-size-medium)",
      },
    },
    cells: {
      style: {
        height: "auto",
        justifyContent: "center",
        textAlign: "center",
        background: 'transparent',
        borderTop: 'var(--standered-border)',
        borderRight: "none",
        color: "var(--text-color-1)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-regular)",
        fontSize: "var(--font-size-small)",
      },
    },
  };

  const shippingTableStyles = {
    headCells: {
      style: {
        height: "52px",
        borderRadius: "4px 4px 0px 0px",
        background: 'transparent',
        opacity: "1",
        textAlign: "center",
        justifyContent: "center",
        border: "none",
        color: "var(--text-color-1)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-medium)",
        fontSize: "var(--font-size-medium)",
      },
    },
    cells: {
      style: {
        height: "75px",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: '15px',
        background: 'transparent',
        borderTop: 'var(--standered-border)',
        borderRight: "none",
        color: "var(--text-color-1)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-regular)",
        fontSize: "var(--font-size-small)",
      },
    },
  };

  const handleRowSelection = (rowId) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.has(rowId)) {
        const updatedSet = new Set(prevSelected);
        updatedSet.delete(rowId);
        return updatedSet;
      } else {
        return new Set([...prevSelected, rowId]);
      }
    });
  };

  const handleAction = (action, row) => {
    console.log(`Action: ${action} triggered for row:`, row);
    // Perform specific action based on the selected option
    switch (action) {
      case "edit":
        handleEdit(row);
        break;
      case "delete":
        handleDelete(row);
        break;
      case "view":
        break;
      default:
        break;
    }
  };

  const handleEdit = (row) => {
    setZoneName(row.zonename || "");
    setShippingStates(row.shippingStates || []);
    setShippingMethods(row.shippingMethods || []);
    setZoneId(row._id || "");
    setIsAddZone(true);
    setIsEditing(true);
  };

  const handleDelete = async (row) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the shipping zone with ID: ${row._id}?`
    );

    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${Url}/api/v1/shipping/delete/${row._id}`
        );

        if (response.status === 200) {
          toast.success("Shipping Zone deleted successfully!");

          fetchTableData();
          fetchStatesData();
        } else {
          toast.error("Failed to delete the Shipping Zone. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting Shipping Zone:", error);
        toast.error("An error occurred while deleting the Shipping Zone.");
      }
    } else {
      toast.info("Deletion cancelled.");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/E-Commerce/Settings/${tab}`);
  };

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          style={{ margin: 0 }}
          onChange={(e) => {
            const isChecked = e.target.checked;
            if (isChecked) {
              setSelectedRows(new Set(data.map((row) => row._id)));
            } else {
              setSelectedRows(new Set());
            }
          }}
          checked={selectedRows.size === data.length && data.length > 0}
        />
      ),
      cell: (row) => (loadingShipping ? <ShimmerLoader width="20px" height="20px" /> :
        <input
          type="checkbox"
          style={{ margin: 0 }}
          checked={selectedRows.has(row._id)}
          onChange={(e) => handleRowSelection(row._id, e.target.checked)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "50px",
    },
    {
      name: "Zone Name",
      selector: (row) => (loadingShipping ? <ShimmerLoader width="150px" height="22.5px" borderRadius="20px" /> : row.zonename),
      width: "230px",
    },
    {
      name: "Regions",
      selector: (row) => (loadingShipping ? <ShimmerLoader width="150px" height="22.5px" borderRadius="20px" /> :
        row.shippingStates && row.shippingStates.length > 0
          ? row.shippingStates.map((state) => state.code).join(", ")
          : "N/A"),
      width: "320px",
    },
    {
      name: "Shipping Method's",
      cell: (row) => {
        return loadingShipping ? (
          <ShimmerLoader width="250px" height="22.5px" borderRadius="20px" />
        ) : row.shippingMethods && row.shippingMethods.length > 0 ? (
          <div style={{ paddingTop: "15px", paddingBottom: "5px" }}>
            {row.shippingMethods.map((method) => (
              <div
                key={method.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "5px",
                  marginBottom: "5px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {method.name}
              </div>
            ))}
          </div>
        ) : (
          "N/A"
        );
      },
      width: "300px",
    },
    {
      name: "Actions",
      cell: (row) =>
        loadingShipping ? (
          <ShimmerLoader width="60px" height="22.5px" />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              style={{
                cursor: "pointer",
                color: "blue",
                marginRight: "8px",
              }}
              onClick={() => handleAction("edit", row)}
            >
              Edit
            </span>
            <img
              src={seperator}
              alt="Separator"
              style={{
                width: "1px",
                height: "18px",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            />
            <span
              style={{
                cursor: "pointer",
                color: "red",
                marginLeft: "8px",
              }}
              onClick={() => handleAction("delete", row)}
            >
              Delete
            </span>
          </div>
        ),
      width: "140px",
    },
  ];

  const shippingaddcolumns = [
    {
      name: "Zone Name",
      selector: (row) => row.zoneName || "Zone Name not entered yet ",
      width: "200px",
    },
    {
      name: "Regions",
      selector: (row) =>
        row.regions && row.regions.length > 0
          ? row.regions.join(", ")
          : "Regions are not selected yet",
      width: "250px",
    },
    {
      name: "Selected Shipping Methods",
      selector: (row) =>
        row.shippingMethods.map((method) => method.name).join("\n"),
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {row.shippingMethods.map((method) => method.name).join("\n")}
        </div>
      ),
      width: "550px",
    },
  ];

  const combinedData = [
    {
      zoneName: zonename,
      regions: shippingStates.map((state) => state.code).filter(Boolean),
      shippingMethods: shippingMethods,
    },
  ];

  /* Open Main Shipping Selection Modal */
  const handleAddShipping = () => {
    setIsShippingModalOpen(true);
  };

  /* Close Main Shipping Selection Modal */
  const createShippingModal = () => {
    setIsShippingModalOpen(false);
  };

    /* Close Main Shipping Selection Modal */
    const closeShippingModal = () => {
      setIsShippingModalOpen(false);
      setShippingMethods([
        { name: "", tax: "", cost: "", min_cost: "" },
        { name: "", tax: "", cost: "", min_cost: "" },
        { name: "", tax: "", cost: "", min_cost: "" },
      ]);
    };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filteredShippingStates = shippingStates.filter(
      (stateObj) => stateObj.state && stateObj.code
    );

    const formattedShippingMethods = shippingMethods.map((method) => ({
      ...method,
      tax: parseInt(method.tax, 10) || 0,
      cost: parseInt(method.cost, 10) || 0,
      min_cost: parseInt(method.min_cost, 10) || 0,
    }));

    const payload = {
      zonename,
      shippingStates: filteredShippingStates,
      shippingMethods: formattedShippingMethods,
    };

    if (isEditing) {
      payload.id = zoneId;
      axios
        .put(`${Url}/api/v1/shipping/edit`, payload)
        .then((response) => {
          toast.success("Shipping Zone updated successfully!");
          resetForm();
          fetchTableData();
          fetchStatesData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to update Shipping Zone. Please try again.");
        });
    } else {
      axios
        .post(`${Url}/api/v1/shipping/add`, payload)
        .then((response) => {
          toast.success("Shipping Zone added successfully!");
          resetForm();
          fetchTableData();
          fetchStatesData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to add Shipping Zone. Please try again.");
        });
    }
  };

  // Reset the form and states
  const resetForm = () => {
    setZoneName("");
    setShippingStates([{ state: "", code: "" }]);
    setShippingMethods([
      { name: "", tax: "", cost: "", min_cost: "" },
      { name: "", tax: "", cost: "", min_cost: "" },
      { name: "", tax: "", cost: "", min_cost: "" },
    ]);
    setIsAddZone(false);
    setIsEditing(false);
  };

  // For Tax Section Handling...
  const handleCheckboxChange = (row, column) => {
    const updatedRow = {
      ...row,
      [`${column}Checked`]: !row[`${column}Checked`],
    };
  };

  const taxcolumns = [
    {
      name: "State",
      selector: (row) => (loadingTax ? <ShimmerLoader width="80px" height="22.5px" borderRadius="20px" /> :
        row.taxStates && row.taxStates[0]
          ? row.taxStates[0].state
          : "Alaska, US"
      ),
      width: "125px",
    },
    {
      name: "Code",
      selector: (row) => (loadingTax ? <ShimmerLoader width="20px" height="20px" /> :
        row.taxStates && row.taxStates[0] ? row.taxStates[0].code : "25352"),
      width: "85px",
    },
    {
      name: "Tax Name",
      selector: (row) => row.tax_name,
      width: "140px",
      cell: (row) => {
        if (loadingTax) {
          return <ShimmerLoader width="80px" height="22.5px" borderRadius="20px" />;
        }

        return (
          <div style={{
            whiteSpace: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            maxHeight: "44px",
          }}>
            {row.tax_name ? row.tax_name : "Shipping Tax"}
          </div>
        );
      },
    },
    {
      name: "Tax Description",
      selector: (row) => (loadingTax ? <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" /> :
        row.tax_description ? row.tax_description : "Shipping Tax"),
      width: "155px",
    },
    {
      name: "Rate",
      selector: (row) => (loadingTax ? <ShimmerLoader width="40px" height="22.5px" borderRadius="10px" /> :
        (row.tax_value ? row.tax_value : "8.00%")),
      width: "75px",
    },
    {
      name: "Priority",
      selector: (row) => (loadingTax ? <ShimmerLoader width="60px" height="22.5px" borderRadius="20px" /> :
        (row.sku ? row.sku : "1")),
      width: "100px",
    },
    {
      name: "Compound",
      selector: (row) => (row.sku ? row.sku : "N/A"),
      width: "120px",
      cell: (row) => (loadingTax ? <ShimmerLoader width="20px" height="20px" /> :
        <input
          type="checkbox"
          checked={row.compoundChecked}
          onChange={() => handleCheckboxChange(row, "compound")}
        />
      ),
    },
    {
      name: "Shipping",
      selector: (row) => (row.sku ? row.sku : "N/A"),
      width: "100px",
      cell: (row) => (loadingTax ? <ShimmerLoader width="20px" height="20px" /> :
        <input
          type="checkbox"
          checked={row.shippingChecked}
          onChange={() => handleCheckboxChange(row, "shipping")}
        />
      ),
    },
    {
      name: "Action",
      cell: (row) => (loadingTax ? <ShimmerLoader width="60px" height="22.5px" /> :
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              cursor: "pointer",
              color: "blue",
              marginRight: "8px",
            }}
            onClick={() => handleTaxAction("edit", row)}
          >
            Edit
          </span>
          <img
            src={seperator}
            alt="Separator"
            style={{
              width: "1px",
              height: "18px",
              marginLeft: "5px",
              marginRight: "5px",
            }}
          />
          <span
            style={{
              cursor: "pointer",
              color: "red",
              marginLeft: "8px",
            }}
            onClick={() => handleTaxAction("delete", row)}
          >
            Delete
          </span>
        </div>
      ),
      width: "140px",
    },
  ];

  // Open Tax Input Modal
  const handleAddTax = () => {
    setIsModalOpen(true);
  };

  // Close Tax Input Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle change function
  const handleTaxChange = (e, field, index = null) => {
    const { name, value } = e.target;

    if (field === "taxData") {
      setTaxData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (field === "taxStates" && index !== null) {
      const updatedStates = [...taxStates];
      updatedStates[index][name] = value;
      setTaxStates(updatedStates);
    }
  };

  // Handle submission
  const handleTaxDataSubmit = (e) => {
    e.preventDefault();

    const filteredTaxStates = taxStates.filter(
      (stateObj) => stateObj.state && stateObj.code
    );

    const formattedRate = parseFloat(taxData.rate) || 0;

    const payload = {
      tax_name: taxData.taxName,
      tax_description: taxData.description,
      tax_value: formattedRate,
      taxStates: filteredTaxStates,
    };

    if (isEditing) {
      payload.id = taxId;
      axios
        .put(`${Url}/api/v1/tax/edit`, payload)
        .then((response) => {
          toast.success("Tax updated successfully!");
          taxresetForm();
          fetchTaxData();
          closeModal();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to update Tax. Please try again.");
        });
    } else {
      axios
        .post(`${Url}/api/v1/tax/add`, payload)
        .then((response) => {
          toast.success("Tax added successfully!");
          taxresetForm();
          fetchTaxData();
          closeModal();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to add Tax. Please try again.");
        });
    }
  };

  const taxresetForm = () => {
    setTaxData({
      taxName: "",
      description: "",
      rate: "",
    });
    setTaxStates([{ state: "", code: "" }]);
  };

  const handleTaxAction = (action, row) => {
    console.log(`Action: ${action} triggered for row:`, row);
    // Perform specific action based on the selected option
    switch (action) {
      case "edit":
        handleTaxEdit(row);
        break;
      case "delete":
        handleTaxDelete(row);
        break;
      case "view":
        break;
      default:
        break;
    }
  };

  const handleTaxEdit = (row) => {
    setTaxData({
      taxName: row.tax_name || "",
      description: row.tax_description || "",
      rate: row.tax_value || "",
    });

    setTaxStates(row.taxStates || [{ state: "", code: "" }]);

    setTaxId(row._id || "");

    setIsModalOpen(true);
    setIsEditing(true);
  };

  const handleTaxDelete = async (row) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this Tax record: ${row._id}?`
    );

    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${Url}/api/v1/tax/delete/${row._id}`
        );

        if (response.status === 200) {
          toast.success("Tax record deleted successfully!");

          fetchTaxData();
          fetchStatesData();
        } else {
          toast.error("Failed to delete this Tax record. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting Tax record:", error);
        toast.error("An error occurred while deleting the Tax record.");
      }
    } else {
      toast.info("Deletion cancelled.");
    }
  };

  // Function is still in working... noted that on cancel modal the shipping array should remove selection.
  const handleCancelShippingSelection = () => {
    const updatedMethods = [...shippingMethods];
    if (index >= 0 && index < updatedMethods.length) {
      updatedMethods[index] = {
        name: "",
        description: "",
        taxable: "",
        tax: "",
        cost: "",
      };

      setShippingMethods(updatedMethods);

    } else {
      console.error("Invalid index or state not updated properly.");
    }

    handleModalToggle("");
  };

  const freeShippingOptions = [
    { value: "No Requirements", label: "No Requirements" },
    {
      value: "A Valid Free Shipping Coupon",
      label: "A Valid Free Shipping Coupon",
    },
    { value: "A Minimum Order Amount", label: "A Minimum Order Amount" },
  ];

  const flatRateOptions = [
    { value: "Taxable", label: "Taxable" },
    { value: "Non Taxable", label: "Non Taxable" },
  ];

  const handleStateSelect = (stateId) => {
    const selectedState = states.find((state) => state._id === stateId);

    if (!selectedState) return;

    setShippingStates((prevStates) => {
      const stateExists = prevStates.some(
        (state) => state.code === selectedState.code
      );

      if (stateExists) {
        return prevStates.filter((state) => state.code !== selectedState.code);
      } else {
        if (selectedState.use_status === "yes") {
          toast.error(
            `State ${selectedState.name} already selected...`
          );
          return prevStates;
        }

        return [
          ...prevStates,
          { state: selectedState.name, code: selectedState.code },
        ];
      }
    });
  };

  const handleStateforTax = (stateId) => {
    const selectedState = states.find((state) => state._id === stateId);

    if (!selectedState) return;

    setTaxStates((prevStates) => {
      const stateExists = prevStates.some(
        (state) => state.code === selectedState.code
      );

      if (stateExists) {
        return prevStates.filter((state) => state.code !== selectedState.code);
      } else {
        if (selectedState.use_status_tax === "yes") {
          toast.error(
            `State ${selectedState.name} already selected...`
          );
          return prevStates;
        }

        return [
          ...prevStates,
          { state: selectedState.name, code: selectedState.code },
        ];
      }
    });
  };

  // State Region Accordion
  const accordionItems = [
    {
      title: (
        <div
          className="scrollable-title"
          style={{
            overflowY: "auto",
            maxHeight: "30px",
            display: "block",
          }}
        >
          {shippingStates.length ? (
            <span>
              Selected Regions:
              {shippingStates.map((stateObj, index) => (
                <span
                  key={index}
                  style={{ marginLeft: "5px", display: "inline-flex" }}
                >
                  {stateObj.state}
                </span>
              ))}
            </span>
          ) : (
            "Select States"
          )}
        </div>
      ),
      content: (
        <div className="category-list-zone">
          {states &&
            states.map((state) => (
              <div key={state._id} className="main-category-zone">
                <div className="category-item-heading-zone">
                  <input
                    type="checkbox"
                    checked={shippingStates.some((s) => s.code === state.code)}
                    onChange={() => handleStateSelect(state._id)}
                  />
                  <span>{state.name}</span>
                </div>
              </div>
            ))}
        </div>
      ),
    },
  ];

  // For Closing all shipping method selection modals...
  const handleShippingSubmit = () => {
    setModals({
      isFreeShippingModalOpen: false,
      isFlatRateModalOpen: false,
      isLocalPickupModalOpen: false,
    });
    setIsShippingModalOpen(true);
  };

  const TaxStates = [
    {
      title: (
        <div
          className="tax-scrollable-title"
          style={{
            overflowY: "auto",
            maxHeight: "30px",
            display: "block",
          }}
        >
          {taxStates.length ? (
            <span>
              Selected Regions:
              {taxStates.map((stateObj, index) => (
                <span
                  key={index}
                  style={{ marginLeft: "5px", display: "inline-flex" }}
                >
                  {stateObj.state}
                </span>
              ))}
            </span>
          ) : (
            "Select States"
          )}
        </div>
      ),
      content: (
        <div className="state-list-zone">
          {states &&
            states.map((state) => (
              <div key={state._id} className="main-category-zone">
                <div className="category-item-heading-zone">
                  <input
                    type="checkbox"
                    checked={taxStates.some((s) => s.code === state.code)}
                    onChange={() => handleStateforTax(state._id)}
                  />
                  <span>{state.name}</span>
                </div>
              </div>
            ))}
        </div>
      ),
    },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(combinedData.length / shippingrowsPerPage);

  // Slice data for current page
  const paginatedData = combinedData.slice(
    (currentPage - 1) * shippingrowsPerPage,
    currentPage * shippingrowsPerPage
  );

  // Page change handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  // Calculate total pages
  const totalShippingPages = Math.ceil(safeData.length / rowsPerPage);

  // Slice data for current page
  const paginatedShippingData = safeData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleShippingPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleShippingNextPage = () => {
    if (currentPage < totalShippingPages) setCurrentPage(currentPage + 1);
  };

  const safeTaxData = Array.isArray(taxGet) ? taxGet : [];

  // Calculate total pages
  const totalTaxPages = Math.ceil(safeTaxData.length / rowsPerPage);

  // Slice data for current page
  const paginatedTaxData = safeTaxData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleTaxPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleTaxNextPage = () => {
    if (currentPage < totalTaxPages) setCurrentPage(currentPage + 1);
  };

  const placeholderRows = Array(7).fill({ uid: "", name: "", image: "" });
  const displayedShippingData = loadingShipping ? placeholderRows : paginatedShippingData;
  const displayedTaxData = loadingTax ? placeholderRows : paginatedTaxData;

  return (
    <div className="AllSettingPage">

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "Shipping" ? "active-tab" : ""
              }`}
            onClick={() => handleTabChange("Shipping")}
          >
            Shipping
          </button>
          <button
            className={`tab-button-2nd ${activeTab === "Tax" ? "active-tab" : ""
              }`}
            onClick={() => handleTabChange("Tax")}
          >
            Tax
          </button>
          <button
            className={`tab-button-3rd ${activeTab === "Location" ? "active-tab" : ""
              }`}
            onClick={() => handleTabChange("Location")}
          >
            Location
          </button>
          <button
            className={`tab-button-4th ${activeTab === "Payments" ? "active-tab" : ""
              }`}
            onClick={() => handleTabChange("Payments")}
          >
            Payments
          </button>
        </div>
        <div className="tabs-border-line"></div>
      </div>

      {/* Tabs Content */}
      {activeTab === "Shipping" && (
        <>
          {isAddZone ? (
            <div>
              <div className="ShippingAdd_Row1">
                <div className="RowData">
                  <label htmlFor="zonename">Zone Name:</label>
                  <input
                    id="zonename"
                    name="zonename"
                    value={zonename}
                    type="text"
                    placeholder="Local Zone"
                    onChange={(e) => handleChange(e, "zonename")}
                  />
                </div>
                <div className="ShippingBack">
                  <CustomBtn
                    label={isEditing ? "Update & Save" : "Create & Save"}
                    withIcon={false}
                    iconType="plus"
                    className="ZoneSaveBtn"
                    type="submit"
                    onClick={handleSubmit}
                  />
                </div>
              </div>

              <div className="ShippingAdd_Row2">
                <div className="RowData-2nd-Update">
                  <label htmlFor="zoneRegion">Zone Regions:</label>
                  {accordionItems.map((item, index) => (
                    <AccordionItem
                      key={index}
                      title={item.title}
                      content={item.content}
                      maxHeight="2000px"
                      headerHeight="32px"
                      containerWidth="400px"
                      BorderRadius="var(--secondry-radius)"
                      BoxShadow="none"
                      Border="1px solid #F0F0F0"
                      Background="#FDFDFD"
                      BorderContent="1px solid #F0F0F0"
                      Display="none"
                    />
                  ))}
                </div>
              </div>

              <div className="ShippingAdd_Row3">
                <div className="RowData-3rd">
                  <div>
                    <DataTable
                      columns={shippingaddcolumns}
                      data={paginatedData}
                      customStyles={shippingTableStyles}
                    />
                    <Pagination
                      activePageIndex={currentPage}
                      totalPages={totalPages}
                      onPrevPage={handlePrevPage}
                      onNextPage={handleNextPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>

              <div className="ShippingAdd_Row4">
                <div className="ShippingSelect">
                  <CustomBtn
                    label="Back to Main Page"
                    withIcon={false}
                    iconType="plus"
                    className="ZoneCancelBtn"
                    onClick={handleBackToShipping}
                    type="submit"
                  />
                  <CustomBtn
                    label="Add Shipping"
                    withIcon={true}
                    iconType="plus"
                    className="ZoneSaveBtn"
                    onClick={handleAddShipping}
                    type="submit"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="sectionall_1">
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <SearchBar
                    onSearch={handleSearch}
                    icon={searchIcon}
                    placeholder={"Search Zone"}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    marginRight: "15px",
                  }}
                >
                  <CustomBtn
                    label="Add Zone"
                    withIcon={true}
                    iconType="plus"
                    className="AddZoneBtn"
                    onClick={handleAddZone}
                    type="submit"
                  />
                </div>
              </div>
              <div className="sectionall_3">
                <div>
                  <DataTable
                    columns={columns}
                    data={displayedShippingData}
                    customStyles={customStyles}
                  />
                  <Pagination
                    activePageIndex={currentPage}
                    totalPages={totalShippingPages}
                    onPrevPage={handleShippingPrevPage}
                    onNextPage={handleShippingNextPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}

      {activeTab === "Tax" && (
        <>
          <div className="sectionall_3">
            <div>
              <DataTable
                columns={taxcolumns}
                data={displayedTaxData}
                customStyles={customStyles}
              />
              <Pagination
                activePageIndex={currentPage}
                totalPages={totalTaxPages}
                currentPage={currentPage}
                onPrevPage={handleTaxPrevPage}
                onNextPage={handleTaxNextPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              marginRight: "8px",
              marginTop: "10px",
            }}
          >
            <CustomBtn
              label="Add Tax"
              withIcon={true}
              iconType="plus"
              className="AddTaxBtn"
              onClick={handleAddTax}
              type="submit"
            />
          </div>
        </>
      )}

      {/* Tax Field Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <span className="Tax-Modal-Heading">Set up Tax</span>
            <div className="FormSection">
              <div className="Form-LeftSide">
                <div style={{ display: "flex", flexDirection: "row", gap: 75 }}>
                  <label>Tax Name:</label>
                  <input
                    type="text"
                    name="taxName"
                    value={taxData.taxName}
                    onChange={(e) => handleTaxChange(e, "taxData")}
                    placeholder="Free Shipping"
                    className="LeftSide-Input"
                    required
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "90%",
                  }}
                >
                  <label>Zone Regions:</label>
                  {TaxStates.map((item, index) => (
                    <AccordionItem
                      key={index}
                      title={item.title}
                      content={item.content}
                      maxHeight="2000px"
                      headerHeight="35px"
                      containerWidth="355px"
                      BorderRadius="0"
                      BoxShadow="none"
                      Border="var(--standered-border)"
                      Background="var(--third-layer-bg)"
                      BorderContent="var(--standered-border)"
                      Display="inline-block"
                    />
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "row", gap: 66 }}>
                  <label>Description:</label>
                  <textarea
                    type="text"
                    name="description"
                    value={taxData.description}
                    onChange={(e) => handleTaxChange(e, "taxData")}
                    placeholder="This is Free Shipping Method..."
                    required
                  />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "row", gap: 112 }}
                >
                  <label>Rate:</label>
                  <input
                    type="text"
                    name="rate"
                    value={taxData.rate}
                    onChange={(e) => handleTaxChange(e, "taxData")}
                    className="LeftSide-Input"
                    placeholder="8.00 %"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Line Divider */}
            <hr
              style={{
                margin: "10px 20px 10px 20px",
                borderColor: "#FDFDFD",
                borderWidth: 2,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <CustomBtn
                label="Cancel"
                withIcon={false}
                iconType="plus"
                className="TaxCancelBtn"
                onClick={closeModal}
                type="button"
              />
              <CustomBtn
                label="Create & Save"
                withIcon={false}
                iconType="plus"
                className="TaxBtn"
                onClick={handleTaxDataSubmit}
                type="submit"
              />
            </div>
          </div>
        </div>
      )}

      {/* Shipping Selection Modal */}
      {isShippingModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeShippingModal}>
              &times;
            </span>
            <span className="Tax-Modal-Heading">Create Shipping Method</span>
            <div className="ShippingTypeSelection">
              <CustomBtn
                label="Free Shipping"
                withIcon={false}
                iconType="plus"
                className="ShippingModalBtn"
                onClick={() => handleModalToggle("isFreeShippingModalOpen")}
                type="button"
              />
              <CustomBtn
                label="Flat Rate"
                withIcon={false}
                iconType="plus"
                className="ShippingModalBtn"
                onClick={() => handleModalToggle("isFlatRateModalOpen")}
                type="button"
              />
              <CustomBtn
                label="Local Pickup"
                withIcon={false}
                iconType="plus"
                className="ShippingModalBtn"
                onClick={() => handleModalToggle("isLocalPickupModalOpen")}
                type="button"
              />
            </div>

            {/* Line Divider */}
            <hr
              style={{
                margin: "10px 20px 10px 20px",
                borderColor: "#FDFDFD",
                borderWidth: 2,
              }}
            />
            <div className="ShippingFooter">
              <div>
                <span className="PageCount">step 1 of 2</span>
              </div>
              <div className="ShippingSelectionBtn">
                <CustomBtn
                  label="Cancel"
                  withIcon={false}
                  iconType="plus"
                  className="ShippingSelectionCancelBtn"
                  onClick={closeShippingModal}
                  type="button"
                />
                <CustomBtn
                  label="Continue"
                  withIcon={false}
                  iconType="plus"
                  className="ShippingSelectionContBtn"
                  onClick={createShippingModal}
                  type="submit"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* For Free Shipping Fields*/}
      {modals.isFreeShippingModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => handleModalToggle("")}>
              &times;
            </span>
            <span className="Tax-Modal-Heading">Set up Free Shipping</span>

            <div className="ShippingTypeSelection">
              <div style={{ display: "flex", flexDirection: "row", gap: 132 }}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={shippingMethods[index]?.name || ""}
                  onChange={(e) => handleChange(e, "shippingMethods", index)}
                  placeholder="Free Shipping"
                  className="input-free-shipping"
                  required
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", gap: 97 }}>
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={shippingMethods[index]?.description || ""}
                  onChange={(e) => handleChange(e, "shippingMethods", index)}
                  placeholder="Free Shipping"
                  className="input-free-shipping"
                  required
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
                <label>Free Shipping Requires:</label>
                <CustomDropdown
                  options={freeShippingOptions}
                  selectedOption={shippingMethods[index]?.requirements || ""}
                  handleOptionChange={(selectedValue) => {
                    const updatedMethods = [...shippingMethods];
                    updatedMethods[index].requirements = selectedValue;
                    setShippingMethods(updatedMethods);
                  }}
                  dropdownHeight="36px"
                  dropdownWidth="442px"
                  backgroundColor="var(--third-layer-bg)"
                  dropdownborder="var(--standered-border)"
                  optionsWidth="440px"
                  optionsBackgroundColor="var(--third-layer-bg)"
                  dropdownMarginBottom={10}
                  dropdownSelectedStyle="8px 7px 7px 7px"
                  arrowSize={16}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <label>Minimum Order Amount:</label>
                <input
                  type="text"
                  name="min_cost"
                  value={shippingMethods[index]?.min_cost || ""}
                  onChange={(e) => handleChange(e, "shippingMethods", index)}
                  placeholder="$ 0"
                  className="input-free-shipping"
                  required
                />
              </div>
            </div>

            <hr
              style={{
                margin: "10px 20px 10px 20px",
                borderColor: "#FDFDFD",
                borderWidth: 2,
              }}
            />
            <div className="ShippingFooter">
              <div>
                <span className="PageCount">step 2 of 2</span>
              </div>
              <div className="ShippingSelectionBtn">
                <CustomBtn
                  label="Back"
                  withIcon={false}
                  iconType="plus"
                  className="ShippingSelectionCancelBtn"
                  onClick={handleCancelShippingSelection}
                  type="button"
                />
                <CustomBtn
                  label="Create & Save"
                  withIcon={false}
                  className="ShippingSelectionContBtn"
                  onClick={handleShippingSubmit}
                  type="button"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* For Flat Rate Fields*/}
      {modals.isFlatRateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => handleModalToggle("")}>
              &times;
            </span>
            <span className="Tax-Modal-Heading">Set up Flat Rate</span>
            <div className="ShippingTypeSelection">
              <div style={{ display: "flex", flexDirection: "row", gap: 55 }}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={shippingMethods[index].name}
                  onChange={(e) => handleChange(e, "shippingMethods", index)}
                  placeholder="Flat Rate"
                  required
                  className="input-flat-rate"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", gap: 19 }}>
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={shippingMethods[index].description}
                  onChange={(e) => handleChange(e, "shippingMethods", 1)}
                  placeholder="Flat Rate"
                  className="input-flat-rate"
                  required
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", gap: 41 }}>
                <label>Taxable:</label>
                <CustomDropdown
                  options={flatRateOptions}
                  selectedOption={shippingMethods[index].taxable}
                  handleOptionChange={(selectedValue) => {
                    const updatedMethods = [...shippingMethods];
                    updatedMethods[index].taxable = selectedValue;
                    setShippingMethods(updatedMethods);
                  }}
                  dropdownHeight="36px"
                  dropdownWidth="510px"
                  backgroundColor="var(--third-layer-bg)"
                  dropdownborder="var(--standered-border)"
                  optionsWidth="508px"
                  optionsBackgroundColor="var(--third-layer-bg)"
                  dropdownMarginBottom={10}
                  dropdownSelectedStyle="8px 7px 7px 7px"
                  arrowSize={16}
                />
              </div>
              {shippingMethods[index].taxable === "Taxable" && (
                <div style={{ display: "flex", flexDirection: "row", gap: 70 }}>
                  <label>Tax:</label>
                  <input
                    type="text"
                    name="tax"
                    value={shippingMethods[index].tax || ""}
                    onChange={(e) => handleChange(e, "shippingMethods", index)}
                    placeholder="$ 0"
                    className="input-flat-rate"
                    required
                  />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "row", gap: 62 }}>
                <label>Cost:</label>
                <input
                  type="text"
                  name="cost"
                  value={shippingMethods[index].cost}
                  onChange={(e) => handleChange(e, "shippingMethods", index)}
                  placeholder="$ 0"
                  className="input-flat-rate"
                  required
                />
              </div>
              <span>
                Charge a flat rate per item, or enter a cost formula to charge a
                percentage based cost or a minimum fee. <br /> Learn more about{" "}
                <a className="link-blue"> advanced cost</a>.
              </span>
            </div>

            <hr
              style={{
                margin: "10px 20px 10px 20px",
                borderColor: "#FDFDFD",
                borderWidth: 2,
              }}
            />
            <div className="ShippingFooter">
              <div>
                <span className="PageCount">step 2 of 2</span>
              </div>
              <div className="ShippingSelectionBtn">
                <CustomBtn
                  label="Back"
                  withIcon={false}
                  iconType="plus"
                  className="ShippingSelectionCancelBtn"
                  onClick={handleCancelShippingSelection}
                  type="button"
                />
                <CustomBtn
                  label="Create & Save"
                  withIcon={false}
                  className="ShippingSelectionContBtn"
                  onClick={handleShippingSubmit}
                  type="button"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* For Local Pickup Fields */}
      {modals.isLocalPickupModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => handleModalToggle("")}>
              &times;
            </span>
            <span className="Tax-Modal-Heading">Set up Local Pickup</span>
            <div className="ShippingTypeSelection">
              <div style={{ display: "flex", flexDirection: "row", gap: 55 }}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={shippingMethods[index]?.name || ""}
                  onChange={(e) => handleChange(e, "shippingMethods", index)}
                  placeholder="Local Pickup"
                  required
                  className="input-flat-rate"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", gap: 19 }}>
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={shippingMethods[index]?.description || ""}
                  onChange={(e) => handleChange(e, "shippingMethods", index)}
                  placeholder="Local Pickup"
                  className="input-flat-rate"
                  required
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", gap: 41 }}>
                <label>Taxable:</label>
                <CustomDropdown
                  options={flatRateOptions}
                  selectedOption={shippingMethods[index].taxable}
                  handleOptionChange={(selectedValue) => {
                    const updatedMethods = [...shippingMethods];
                    updatedMethods[index].taxable = selectedValue;
                    setShippingMethods(updatedMethods);
                  }}
                  dropdownHeight="36px"
                  dropdownWidth="510px"
                  backgroundColor="var(--third-layer-bg)"
                  dropdownborder="var(--standered-border)"
                  optionsWidth="508px"
                  optionsBackgroundColor="var(--third-layer-bg)"
                  dropdownMarginBottom={10}
                  dropdownSelectedStyle="8px 7px 7px 7px"
                  arrowSize={16}
                />
              </div>
              {shippingMethods[index].taxable === "Taxable" && (
                <div style={{ display: "flex", flexDirection: "row", gap: 70 }}>
                  <label>Tax:</label>
                  <input
                    type="text"
                    name="tax"
                    value={shippingMethods[index].tax || ""}
                    onChange={(e) => handleChange(e, "shippingMethods", index)}
                    placeholder="$ 0"
                    className="input-flat-rate"
                    required
                  />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "row", gap: 62 }}>
                <label>Cost:</label>
                <input
                  type="text"
                  name="cost"
                  value={shippingMethods[index]?.cost || ""}
                  onChange={(e) => handleChange(e, "shippingMethods", index)}
                  placeholder="$ 0"
                  className="input-flat-rate"
                  required
                />
              </div>
              <span>Optional cost for local pick up.</span>
            </div>

            <hr
              style={{
                margin: "10px 20px 10px 20px",
                borderColor: "#FDFDFD",
                borderWidth: 2,
              }}
            />
            <div className="ShippingFooter">
              <div>
                <span className="PageCount">step 2 of 2</span>
              </div>
              <div className="ShippingSelectionBtn">
                <CustomBtn
                  label="Cancel"
                  withIcon={false}
                  iconType="plus"
                  className="ShippingSelectionCancelBtn"
                  onClick={handleCancelShippingSelection}
                  type="button"
                />
                <CustomBtn
                  label="Create & Save"
                  withIcon={false}
                  className="ShippingSelectionContBtn"
                  onClick={handleShippingSubmit}
                  type="button"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Location" && <StoreLocator />}

      {activeTab === "Payments" && <PayMethods />}

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ECommerceSettings;