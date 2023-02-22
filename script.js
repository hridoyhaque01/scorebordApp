// select dom elements

const addMatchBtn = document.querySelector(".add_match .btn");
const matchContainer = document.querySelector(".all-matches");
const resetBtn = document.querySelector(".lws-reset");

// action identifiers

const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESET = "reset";
const ADDMATCH = "addmatch";
const DELETEMATCH = "deletematch";

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

const addmatch = (id, srNo) => {
  return {
    type: ADDMATCH,
    payload: { id: id, serialNo: srNo, value: 0 },
  };
};

const reset = () => {
  return {
    type: RESET,
  };
};

const deleteMatch = (id) => {
  return {
    id: id,
    type: DELETEMATCH,
  };
};

const initialState = [
  {
    id: new Date().getTime().toString(),
    serialNo: 1,
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

    case DELETEMATCH:
      return state.filter((currentObj) => currentObj.id !== action.id);
    default:
      return state;
  }
}

// create store

const store = Redux.createStore(matchReducer);

// clear matches

matchContainer.innerHTML = "";

// render function

const render = () => {
  const state = store.getState();
  matchContainer.innerHTML = "";
  state.map((item, index) => {
    matchContainer.innerHTML += `<div class="match" id=${item.id}>
  <div class="wrapper">
    <button class="lws-delete" onClick="deleteDispatch(${item.id})">
      <img src="./image/delete.svg" alt="" />
    </button>
    <h3 class="lws-matchName">Match ${state[index].serialNo}</h3>
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
      ${state[index].value}
    </h2>
  </div>
</div>`;
  });
};

render();

// update UI initially

store.subscribe(render);

//Add new match

addMatchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const srNo = store.getState().length + 1;
  const id = new Date().getTime().toString();
  store.dispatch(addmatch(id, srNo));
});

// submit from values

matchContainer.addEventListener("submit", function (event) {
  event.preventDefault();

  const id = event.target.parentNode.parentNode.id;

  if (event.target.classList.contains("incrementForm")) {
    const value = event.target.querySelector("input").value;
    incrementScore(id, value);
  }

  if (event.target.classList.contains("decrementForm")) {
    const value = event.target.querySelector("input").value;
    decrementScore(id, value);
  }
});

// reset match scores

resetBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));
  store.dispatch(reset());
});

// increment score function

const incrementScore = (index, value) => {
  const id = index;
  const parseValue = parseInt(value);
  store.dispatch(increment(id, parseValue));
};

// decrement score function

const decrementScore = (index, value) => {
  const id = index;
  const parseValue = parseInt(value);
  store.dispatch(decrement(id, parseValue));
};

// delete match

const deleteDispatch = (index) => {
  const id = index.toString();
  store.dispatch(deleteMatch(id));
};
