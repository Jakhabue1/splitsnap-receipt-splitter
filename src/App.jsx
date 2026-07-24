import { useState } from "react";
import "./App.css";

function App() {
  const [step, setStep] = useState(1);
  const [receiptName, setReceiptName] = useState("");
  const [people, setPeople] = useState([""]);
  const [items, setItems] = useState([
    {
      name: "",
      price: "",
      assignedTo: "",
    },
  ]);

  function addPerson() {
    setPeople([...people, ""]);
  }

  function updatePerson(index, value) {
    const updatedPeople = [...people];
    updatedPeople[index] = value;
    setPeople(updatedPeople);
  }

  function addItem() {
    setItems([
      ...items,
      {
        name: "",
        price: "",
        assignedTo: "",
      },
    ]);
  }

  function updateItem(index, field, value) {
    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setItems(updatedItems);
  }

  function goToAssignments() {
    const validPeople = people.filter(
      (person) => person.trim() !== ""
    );

    const validItems = items.filter(
      (item) =>
        item.name.trim() !== "" &&
        item.price !== "" &&
        Number(item.price) > 0
    );

    if (receiptName.trim() === "") {
      alert("Enter a receipt name.");
      return;
    }

    if (validPeople.length === 0) {
      alert("Add at least one person.");
      return;
    }

    if (validItems.length === 0) {
      alert("Add at least one item with a valid price.");
      return;
    }

    setPeople(validPeople);
    setItems(validItems);
    setStep(2);
  }

  function calculateTotals() {
    const everyItemAssigned = items.every(
      (item) => item.assignedTo !== ""
    );

    if (!everyItemAssigned) {
      alert("Assign every item to a person.");
      return;
    }

    setStep(3);
  }

  function getPersonTotal(person) {
    return items
      .filter((item) => item.assignedTo === person)
      .reduce((total, item) => total + Number(item.price), 0);
  }

  function getReceiptTotal() {
    return items.reduce(
      (total, item) => total + Number(item.price),
      0
    );
  }

  function startOver() {
    setStep(1);
    setReceiptName("");
    setPeople([""]);
    setItems([
      {
        name: "",
        price: "",
        assignedTo: "",
      },
    ]);
  }

  return (
    <main className="app">
      <section className="container">
        <header>
          <p className="logo">SplitSnap Receipt Splitter</p>

          <h1>
            {step === 1 && "Split a receipt without the confusion."}
            {step === 2 && "Assign each item."}
            {step === 3 && "Your split is ready."}
          </h1>

          <p className="subtitle">
            {step === 1 &&
              "Add everyone, enter the items, and calculate what each person owes."}

            {step === 2 &&
              `Choose who ordered each item from ${receiptName}.`}

            {step === 3 &&
              `Here is the final breakdown for ${receiptName}.`}
          </p>
        </header>

        {step === 1 && (
          <>
            <section className="card">
              <h2>Receipt details</h2>

              <label htmlFor="receiptName">
                Receipt name
              </label>

              <input
                id="receiptName"
                type="text"
                placeholder="Example: Dinner at Chili's"
                value={receiptName}
                onChange={(event) =>
                  setReceiptName(event.target.value)
                }
              />
            </section>

            <section className="card">
              <div className="sectionHeading">
                <h2>People</h2>

                <button
                  type="button"
                  className="smallButton"
                  onClick={addPerson}
                >
                  + Add person
                </button>
              </div>

              {people.map((person, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Person ${index + 1}`}
                  value={person}
                  onChange={(event) =>
                    updatePerson(index, event.target.value)
                  }
                />
              ))}
            </section>

            <section className="card">
              <div className="sectionHeading">
                <h2>Receipt items</h2>

                <button
                  type="button"
                  className="smallButton"
                  onClick={addItem}
                >
                  + Add item
                </button>
              </div>

              {items.map((item, index) => (
                <div className="itemRow" key={index}>
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.name}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "name",
                        event.target.value
                      )
                    }
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={item.price}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "price",
                        event.target.value
                      )
                    }
                  />
                </div>
              ))}
            </section>

            <button
              type="button"
              className="continueButton"
              onClick={goToAssignments}
            >
              Continue to assignments
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <section className="card">
              <h2>Assign items</h2>

              {items.map((item, index) => (
                <div className="assignmentRow" key={index}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>${Number(item.price).toFixed(2)}</p>
                  </div>

                  <select
                    value={item.assignedTo}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "assignedTo",
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Choose a person
                    </option>

                    {people.map((person, personIndex) => (
                      <option
                        key={personIndex}
                        value={person}
                      >
                        {person}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </section>

            <button
              type="button"
              className="continueButton"
              onClick={calculateTotals}
            >
              Calculate totals
            </button>

            <button
              type="button"
              className="backButton"
              onClick={() => setStep(1)}
            >
              Back
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <section className="totalCard">
              <p className="totalLabel">Receipt total</p>

              <h2 className="receiptTotal">
                ${getReceiptTotal().toFixed(2)}
              </h2>

              <p className="receiptTitle">
                {receiptName}
              </p>
            </section>

            <section className="card">
              <h2>Who owes what</h2>

              {people.map((person, index) => (
                <div className="personTotalRow" key={index}>
                  <div>
                    <strong>{person}</strong>

                    <p>
                      {
                        items.filter(
                          (item) =>
                            item.assignedTo === person
                        ).length
                      }{" "}
                      item(s)
                    </p>
                  </div>

                  <span>
                    ${getPersonTotal(person).toFixed(2)}
                  </span>
                </div>
              ))}
            </section>

            <section className="card">
              <h2>Item breakdown</h2>

              {items.map((item, index) => (
                <div className="breakdownRow" key={index}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.assignedTo}</p>
                  </div>

                  <span>
                    ${Number(item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </section>

            <button
              type="button"
              className="continueButton"
              onClick={startOver}
            >
              Split another receipt
            </button>

            <button
              type="button"
              className="backButton"
              onClick={() => setStep(2)}
            >
              Back to assignments
            </button>
          </>
        )}
      </section>
    </main>
  );
}

export default App;