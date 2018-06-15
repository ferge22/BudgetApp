'use strict'
//BUDGET CONTROLLER----------------------------------------------------------------------------------------------
var budgetController = (function(){

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.precentage = -1;
	};

	//cacl precentage
	Expense.prototype.calcPrecentages = function(totalIncome){
		if(totalIncome > 0){
			this.precentage = Math.round((this.value / totalIncome) * 100);
		}
		else{
			this.precentage = -1;
		}
	};

	//get precentage
	Expense.prototype.getPrecentages = function(){
		//grazina is konstruktoriaus sukaicuota precentage
		return this.precentage;
	};

	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(curr){
			sum += curr.value;
		})

		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},

		budget: 0,
		precentage: -1
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

		//delete item form array by type and id
		deleteItem:  function(type, id){
			var ids, index;

			//mapas returinina nauja array todel prisiskiriam ids
			ids = data.allItems[type].map(function(current){
				return current.id
				//grazins, pvz turim inc masyve 5 objektus su ids 1,2,6,7,8 tai ir tai grazins
			});

			//indexof grazins index number elemento masyve
			//ids obj id, o id masyvo id
			//pvz [1 2 5 6 7] tai obj ids = 6 , tai masyvo index(id) = 3!!!;
			index = ids.indexOf(id);

			if(index !== -1){
				//index 
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function(){

			//Calculate total income and expenses
			calculateTotal('inc');
			calculateTotal('exp');

			//Calulate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			//Calculate the precentage of income what we spent
			if(data.totals.inc > 0){
				data.precentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}
			else{
				data.precentage = -1;
			}
 
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				precentage: data.precentage
			};
		},

		calculatePrecentages: function(){
			//exp/total * 100;
			//current tai butent tas exp elementas masyve
			//suskaiciavo kiekveinam exp obj procentus
			//foreach nestorina i variable o tik padaro siuo atveju objekte sukaciuoja procentus
			data.allItems.exp.forEach(function(current){
				current.calcPrecentages(data.totals.inc);
			});
		},

		getPrecentages: function(){
			//map kai norim stroing kazkur informacija
			//map kazka grazina todel isaugom i kintamaji
			var allPrec = data.allItems.exp.map(function(cur){
				//pvz 5 obj exp obj tai, 5 storins i allPrec var, veliau ji returiniam 
				return cur.getPrecentages();
			});

			return allPrec;
		},

		testing: function(){
			console.log(data);
		}
	}

	// return {
	// 	Expenses:  (function(){
	// 		return Expenses
	// 	})()
	// }
	
})();


//UI CONTROLLER---------------------------------------------------------------------------------------------------
var UIController = (function(){

	//all DOM strings
	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		precentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPrecLabel: '.item__percentage'

	}

	//return to public, than other controler can take what i returned
	return {
		getInput: function(){
			//return an object
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
			}

		},

		addListItem: function(obj, type){
			var html, newHtml, element;
			//Create html string with placeholder text
			if(type === 'inc'){
				element = DOMStrings.incomeContainer
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'                     
			}

			else if(type === 'exp'){
				element = DOMStrings.expensesContainer
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}

			//Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			//Insert HTML to dom
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		deleteListItem: function(selectorID){
			var el;

			//pradziai gauni ta elementa kur id stovi, kylu i virsu,
			//dabar esu income__list, removeshild tada zemiau to list deletina
			//visa elementa kuri nurodai removeChild
			el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);

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

		displayBudget: function(obj){
			document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;


			if(obj.precentage > 0){
				document.querySelector(DOMStrings.precentageLabel).textContent = obj.precentage + '%';
			}
			else {
				document.querySelector(DOMStrings.precentageLabel).textContent = '--';
			}
		},

		displayPercentages: function(percentages){


			//gaunu node lista
			var fields = document.querySelectorAll(DOMStrings.expensesPrecLabel);

			//lupinu per lista
			var nodeListForEach = function(list, callback){
				for(var i = 0; i< list.length; i++){
					//mano calback function pareina i nodelistforeach funcion parametrus
					//list[i] i current, o i i index
					callback(list[i], i);
				}
			};

			//nuo kur function prasideda tai ten  calbackas
			nodeListForEach(fields, function(current, index){
				if(percentages[index] > 0){

				//percentages index, at 1 element -> 1 percentage ir t.t.
					current.textContent = percentages[index] + '%';
				}
				else{
					current.textContent = '--';
				}

			});

		},

		getDOMstrings: function(){
			return DOMStrings
		}
	}

})();

//ateina budgetController apacioje ir jo vardas visada bus budgetCtrl
//GLOBAL APP CONTROLLER--------------------------------------------------------------------------------------------
var controller = (function(budgetCtrl, UICtrl){

	//init function
	var setupEventListeners = function(){
		//from UI controler returned DOMStrings object
		var DOM = UICtrl.getDOMstrings();
		// console.log(DOM);

		//action 2 after click on button is pressed, it calls ctrlAddItem
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		//action 1 after enter is pressed, it calls ctrlAddItem
		document.addEventListener('keypress', function(event){
				if(event.keyCode === 13 || event.which === 13){
				ctrlAddItem();
				}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	}

	var updateBudget = function(){

		//Calculate the budget
		budgetCtrl.calculateBudget();

		//Return a budget from budgetCtrl save it to var because we return 4 items
		var budget = budgetCtrl.getBudget();
		// console.log(budget);

		//Display budget to UI
		UICtrl.displayBudget(budget);

	}

	var updatePrecentage = function(){

		//Calculate precentages
		budgetCtrl.calculatePrecentages();

		//Read precentages from the budgetContr
		var precentages = budgetCtrl.getPrecentages();

		//Update UI with new precentages
		// console.log(precentages);
		UICtrl.displayPercentages(precentages);
	}

	var ctrlAddItem = function(){

		var input, newItem;
		//get input field data from UI controller
		input = UICtrl.getInput();
		// console.log(input)

		if(input.description !=="" && !isNaN(input.value) && input.value > 0){

			//add item to budget controller
			//istrturininas objektas is budget controller todel saugoti reikia i kintamaji
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//kviesdamas addListItem funkcija idedu objekta bei type
			var item = UICtrl.addListItem(newItem, input.type);

			//clear the fields is UiController
			UICtrl.clearFields();

			//calculate and update Budget
			updateBudget();

			//calculate and update precentages
			updatePrecentage();
		}

		else{
			console.log('Please fill input fields');
		}

	};

	//Event delegation, event bubbling-------------------------------------
	// event, del to kad norim zinoti koks target elementas yra(ant kur paspaudem)
	var ctrlDeleteItem = function(event){
		var itemId, splitID, type, ID;
		//paspaudus gauna ta html elementa
		// console.log(event.target);

		//Dom traversing, keliaujam auksciau nuo i elemento
		//neveikia ant explorer
		// console.log(event.target.closest('.item').id);

		itemId = event.target.parentNode.parentNode.parentNode.parentNode.id

		if(itemId){
			//inc-1 -> inc ir 1 , tada atskitai type(inc) ir id(1)
			splitID = itemId.split('-');
			// console.log(splitID);
			type = splitID[0];
			ID = parseInt(splitID[1]);

			//delete item from data structure
			budgetCtrl.deleteItem(type, ID);

			//delete item from user interface
			UICtrl.deleteListItem(itemId);

			//update budget
			updateBudget();

			//calculate and update precentages
			updatePrecentage();
		}
	} 

	return {
		init: function(){
			console.log('Application has started');
			// after enter is pressed or clicked on submit
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				precentage: -1
			})
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