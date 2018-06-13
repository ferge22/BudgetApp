'use strict'
//BUDGET CONTROLLER
var budgetController = (function(){

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	}


	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	}

	return {
		addItem : function(type, description, value){
			var newItem, ID;

			// create new ID
			// lendu i data pbj -> all items ->type priklauso nuo pasirinkimo
			// tada vel lendu data -> all items -> type, nes objektas naujas,
			// ilgis - 1, nes reikia paskutino elemento masyve(nes nuo 0 skaciuojasi)
			// id + 1, norim ne paskutinio bet paskutinis +1

			// [1 2 3 4 5 ], next id = 6
			// [1 2 3 4 5 ], next id = 9
			// ID = last ID + 1
			if(data.allItems[type].length > 0){

				ID=data.allItems[type][data.allItems[type].length - 1].id + 1;
			}

			else{

				ID = 0;
			}

			//create new item based on 'inc' or 'exp' type
			if(type === 'exp'){
				newItem = new Expense(ID, description, value);
			}
			else if(type === 'inc'){
				newItem = new Income(ID, description, value);
			}

			//Push it into our data structure 
			data.allItems[type].push(newItem);

			// Return the new element
			return newItem;
		},

		testing : function(){
			console.log(data);
		}
	}

	// return {
	// 	Expenses:  (function(){
	// 		return Expenses
	// 	})()
	// }
	
})();


//UI CONTROLLER
var UIController = (function(){

	//all DOM strings
	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list'
	}

	//return to public, than other controler can take what i returned
	return {
		getInput: function(){
			//return an object
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: document.querySelector(DOMStrings.inputValue).value
			}

		},

		addListItem: function(obj, type){
			var html, newHtml, element;
			//Create html string with placeholder text
			if(type === 'inc'){
				element = DOMStrings.incomeContainer
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'                     
			}

			else if(type === 'exp'){
				element = DOMStrings.expensesContainer
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}

			//Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			//Insert HTML to dom
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		clearFields: function(){
			var fields, fieldsArr;

			//paselektinu inout,desc it input.val
			//gaunu kaip lista, todel reikia verst i masyva
			fields = document.querySelectorAll(DOMStrings.inputDescription + ', '
			+ DOMStrings.inputValue);

			//listo vertimas i masyva, call nes kveciu fields ir imu is globalaus Array slice
			fieldsArr = Array.prototype.slice.call(fields);

			//paverstas listas i masyva
			//curr tai input desc
			//index tai indexas siu atveju 2, tai 0 arba 1
			//array visas fieldsArr
			fieldsArr.forEach(function(current, index, array){
				current.value = "";

			});

			// grazina i description focusa
			fieldsArr[0].focus()

		},

		getDOMstrings: function(){
			return DOMStrings
		}
	}

})();

//ateina budgetController apacioje ir jo vardas visada bus budgetCtrl
//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

	//init function
	var setupEventListeners = function(){

		//action 1 after enter is pressed, it calls ctrlAddItem
		document.addEventListener('keypress', function(event){
				if(event.keyCode === 13 || event.which === 13){
				ctrlAddItem();
				}
		});

		//action 2 after click on button is pressed, it calls ctrlAddItem
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
	}

	//from UI controler returned DOMStrings object
	var DOM = UICtrl.getDOMstrings();
	// console.log(DOM);

	var ctrlAddItem = function(){
		var input, newItem;
		//get input field data from UI controller
		input = UICtrl.getInput();

		// console.log(input)

		//add item to budget controller
		//istrturininas objektas is budget controller todel saugoti reikia i kintamaji
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		//kviesdamas addListItem funkcija idedu objekta bei type
		var item = UICtrl.addListItem(newItem, input.type);

		//clear the fields is UiController
		UICtrl.clearFields();

	} 

	return {
		init: function(){
			console.log('Application has started');
			// after enter is pressed or clicked on submit
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();




































































/*
var budgetController = (function(){

	var x = 23;

	var add = function(a){
		return x+a;
	}

	return {
		publicTest: function(b){
			return add(b);
		}
	}

})();


var UIController = (function(){




})();

//ateina budgetController apacioje ir jo vardas visada bus budgetCtrl
var controller = (function(budgetCtrl, UICtrl){

	var z = budgetCtrl.publicTest(5);

	return {
		anotherPublic: function(){
			console.log(z);
		}
	}



})(budgetController, UIController);

*/