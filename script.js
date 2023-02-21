// select dom elements

const addMatchBtn = document.querySelector(".add_match .btn");
const alMatchEl = document.querySelector(".all-matches");
const resetBtn = document.querySelector(".lws-reset");

// action identifiers

const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESET = "reset";
const ADDMATCH = "addmatch";

// action creators

const increment = (id, value) => {
  return {
    id: id,
    type: INCREMENT,
    payload: value,
  };
};

const decrement = (id, value) => {
  return {
    id: id,
    type: DECREMENT,
    payload: value,
  };
};

const addmatch = (id) => {
  return {
    type: ADDMATCH,
    payload: { id: id, value: 0 },
  };
};

const reset = () => {
  return {
    type: RESET,
  };
};

const initialState = [
  {
    id: 1,
    value: 0,
  },
];

// create reducer function

function matchReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return state.map((currentObj) =>
        currentObj.id === action.id
          ? {
              ...currentObj,
              value:
                currentObj.value + action.payload > 0
                  ? currentObj.value + action.payload
                  : 0,
            }
          : { ...currentObj }
      );

    case DECREMENT:
      return state.map((currentObj) =>
        currentObj.id === action.id
          ? {
              ...currentObj,
              value:
                currentObj.value - action.payload > 0
                  ? currentObj.value - action.payload
                  : 0,
            }
          : { ...currentObj }
      );

    case RESET:
      return state.map((currentObj) => {
        return {
          ...currentObj,
          value: 0,
        };
      });

    case ADDMATCH:
      return [...state, action.payload];

    default:
      return state;
  }
}

// create store

const store = Redux.createStore(matchReducer);

// render function

const render = () => {
  const state = store.getState();
  const numberItems = document.querySelectorAll(".numbers h2");
  numberItems.forEach((item, index) =>
    (item.innerText = state[index].value).toString()
  );
};

// update UI initially

render();

store.subscribe(render);

//Add match by clicking the button

addMatchBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const stateLength = store.getState().length;
  store.dispatch(addmatch(stateLength + 1));
  const matchEl = `<div class="match">
      <div class="wrapper">
        <button class="lws-delete">
          <img src="./image/delete.svg" alt="" />
        </button>
        <h3 class="lws-matchName">Match ${stateLength + 1}</h3>
      </div>
      <div class="inc-dec">
        <form class="incrementForm">
          <h4>Increment</h4>
          <input type="number" name="increment" class="lws-increment" />
        </form>
        <form class="decrementForm">
          <h4>Decrement</h4>
          <input type="number" name="decrement" class="lws-decrement" />
        </form>
      </div>
      <div class="numbers">
        <h2 class="lws-singleResult">
          0
        </h2>
      </div>
    </div>`;

  alMatchEl.insertAdjacentHTML("beforeend", matchEl);
});

// Get each input field and call dispatch function

alMatchEl.addEventListener("submit", function (event) {
  event.preventDefault();

  // get targeted match index

  const matchIndex = Array.from(alMatchEl.querySelectorAll(".match")).indexOf(
    event.target.parentNode.parentNode
  );

  if (event.target.classList.contains("incrementForm")) {
    const value = event.target.querySelector("input").value;
    incrementDispatch(matchIndex, value);
  }

  if (event.target.classList.contains("decrementForm")) {
    const value = event.target.querySelector("input").value;
    decrementDispatch(matchIndex, value);
  }
});

// increment dispatch function

const incrementDispatch = (index, value) => {
  const id = index + 1;
  const parseValue = parseInt(value);
  store.dispatch(increment(id, parseValue));
};

// decrement dispatch function

const decrementDispatch = (index, value) => {
  const id = index + 1;
  const parseValue = parseInt(value);
  store.dispatch(decrement(id, parseValue));
};

// reset matches

resetBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));
  store.dispatch(reset());
});
