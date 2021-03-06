/********************************Global Variables********************************/
var playerArray = [];
var round = 1;
var hand;
var handZero = false;
var handSet = false;
var dealerIs;

/************************************OBJECTS************************************/
//Player object.  Stores the player's "number" and score. 
function player(name) {
	this.name = name;
	this.score = 0;
	this.playerNumber = "Player" + playerArray.length;
	this.bet = 0;
};

/******************************JavaScript Functions*****************************/
//Function that creates a new player object.  Takes in name as input.
function addPlayer(name){
	if(playerArray.length > 5){
		alert("Sorry, you've reached the maximum number of players.");
	}
	else{
		if (name == ''){
			alert("Please enter a valid name.");
		}
		else{
			playerArray.push(new player(name));

			var p = playerArray[playerArray.length - 1]

			addPlayerToPlayerScreen(p);
			addPlayerToGameScreen(p);
			addPlayerToScoreScreen(p);
		};
	};
};

function addPlayerToPlayerScreen(player){
	$('#playerList').append('<div class="ui-block-a '+player.playerNumber+'" style="padding:1em; font-size:large">' + player.name + '</div>');
	$('#playerList').append('<div class="ui-block-b '+player.playerNumber+ ' remove-btn" data-role="button" ui-icon="minus"><image src="img/minus.png" width="25" height="25" id="remove-btn-'+player.playerNumber+'"></div>');
}

//Function that adds the Player to the Game screen.  Sets up the columns and rows.  Also gives unique ID, that is tied to a player object, to each rows checkbox and bet so that it can be checked for scoring.
function addPlayerToGameScreen(player){

	$('#gameScreen').append('<div class="ui-block-a '+player.playerNumber+'" style="width:40%; padding: .5em; font-size: large;">' + player.name + '<div>');
	
	//if(isTeamGame()){
		//append dual score boxes
		$('#gameScreen').append('<div class="ui-block-b '+player.playerNumber+'" style="width:30%; padding: .5em;">' + '<input type="number" data-role="none" min="0" max="12" style ="width:3em" name="' + player.playerNumber + 'A-Bet">' + '<input type="number" data-role="none" min="0" max="12" style ="width:3em" class="betBox2" name="' + player.playerNumber + 'B-Bet">' + '</div>');		
		$('#gameScreen').append('<div class="ui-block-c '+player.playerNumber+'" style="width:30%; padding: .5em;">' + '<input type="checkbox" data-role="none" name="' + player.playerNumber + 'Check">' + '</div>');
		$('.betBox2').hide();
//	}
//	else{
		//append single score box
//		$('#gameScreen').append('<div class="ui-block-b '+player.playerNumber+'" style="width:30%; padding: .5em;">' + '<input type="number" data-role="none" min="0" max="12" style ="width:3em" name="' + player.playerNumber + 'Bet">' + '</div>');		
//		$('#gameScreen').append('<div class="ui-block-c '+player.playerNumber+'" style="width:30%; padding: .5em;">' + '<input type="checkbox" data-role="none" name="' + player.playerNumber + 'Check">' + '</div>');
//	}

};

function toggleTeams(){
	if(isTeamGame()){
		$('.betBox2').show();
	}else if(!isTeamGame()){
		$('.betBox2').hide();
	}
};

function addPlayerToScoreScreen(player){
	$('.player_col').append('<td class ="'+player.playerNumber+'" id="' + player.playerNumber + '"><b>' + player.name + '</b></td>');
};

function removePlayer(playerNumber){

	if(round > 1){
		alert('Players cannot be removed after the game has started')
	}
	else{
		var p = '.'+playerNumber;
		$(p).remove();
		var key = playerNumber.replace(/\D/g,'')
		playerArray.splice(key,1); //remove from playerArray
	}
}

function randDealer(){
//The game requires at least 3 players to play so if the player array is less than 2, it will alert the user to enter more players.
	if(playerArray.length <= 2){  
		alert("Please add at least three players first")
	}else{
		var rand = Math.floor((Math.random() * playerArray.length));
		var randomDealer = playerArray[rand];
		alert("Dealer is: " + randomDealer.name);
		dealerIs = randomDealer;
	}
}

function setRound(){
	if(hand == 1){
		handZero=true;
	}
	
	if(handSet == false){
		document.getElementById('hand-counter').innerHTML = "";
	}else{
		if(handZero == true){
			hand +=1;
		}
		else{
			hand -=1;
		}
		document.getElementById('hand-counter').innerHTML = "<h3>Current Hand: " + hand + "</h3>";			
	}
	round +=1;
}

/****************************Scoring System Functions****************************/
function scoreRound(isTeamGame){
	if(validateBet() == false){
		return;
	}
	setRound();
	$('#scores_table').append('<tr id="round' + round +'">' + '<td>' + round + '</td>');
	for(var x=0;x < playerArray.length;x++){
		var bet = getBet(x);
		var happy = $('input[name=' + playerArray[x].playerNumber + 'Check]').is(':checked');
		if(happy === true){
			playerArray[x].score = playerArray[x].score + 10 + bet;
			$('#round' + round).append('<td>' + playerArray[x].score + '</td>');	
		}
		else{
			playerArray[x].score = playerArray[x].score - bet;
			$('#round' + round).append('<td style="color:red;">' + playerArray[x].score + '</td>');
		}
	};	
	resetBet();
	$('#scores_table').append('</tr>');
	setCurrentScore();
	$('input[name="hand-size"]').prop('disabled' , true);
	setTeamButton();
};

function resetBet(){
	for(var x=0; x<playerArray.length; x++){
		$('input[name=' + playerArray[x].playerNumber + 'Bet]').val('');
		$('input[name=' + playerArray[x].playerNumber + 'A-Bet]').val('');
		$('input[name=' + playerArray[x].playerNumber + 'B-Bet]').val(''); 
		$('input[name=' + playerArray[x].playerNumber + 'Check]').prop("checked", false);
	}
}

function getBet(element){
	var bet1 = parseInt($('input[name=' + playerArray[element].playerNumber + 'A-Bet]').val(), 10);
	var bet2 = parseInt($('input[name=' + playerArray[element].playerNumber + 'B-Bet]').val(), 10);
	//assume empty bets are 0
	bet1 = isNaN(bet1) ? 0 : bet1;
	bet2 = isNaN(bet2) ? 0 : bet2;
	return bet1 + bet2;
}

function validateBet(){
	if(isNaN(hand) === false){
		handSet = true;
	}else{
		hand = parseInt($('input[name=hand-size]').val(), 10);
		if(isNaN(hand) == false){
			handSet = true;
		}
	}
	for(var x=0;x < playerArray.length;x++){
		var bet1 = parseInt($('input[name=' + playerArray[x].playerNumber + 'A-Bet]').val(), 10);
		var bet2 = parseInt($('input[name=' + playerArray[x].playerNumber + 'B-Bet]').val(), 10);
		//assume empty bets are 0
		bet1 = isNaN(bet1) ? 0 : bet1;
		bet2 = isNaN(bet2) ? 0 : bet2;
		/*doing some validation*/
		if(bet1 + bet2 < 0){
			alert("Please check the bets.  You cannot have a bet total less than zero.");
			return false;
		}else if(handSet == true && bet1 + bet2 > hand){
			alert("Please check the bets.  You cannot have a bet greater than the hand size.");
			return false;
		}
	}
	return true;	
}
	
function isTeamGame(){
	return $('[name="teams-flip"]').is(":checked") ? true :false;
}
	
function setTeamButton(){
	if(playerArray.length > 0){
		$('[name="teams-flip"]').flipswitch('disable');
	}else{
		$('[name="teams-flip"]').flipswitch('enable');
	}
}
	
function setCurrentScore(){
	var tr = $('#live_scores');  //Creates a variable that is set to the live_scores ID (which is non-existent the first time)
	tr.remove();  //removes the table row so it can be updated(recreated) later
	$('#current_scores').append('<tr id="live_scores"></tr>');  //recreating the table row (id=live_scores) and appending it to the current scores table
	//loops through the player array and appends the current score for that player to the live_scores row
	for(var x = 0; x < playerArray.length; x++){
		$('#live_scores').append('<td>' + playerArray[x].score + '</td>');
	}
}	

$(document).ready(function(){
	
	/********************************JQuery Functions*******************************/
	//This function listens for the add button (id of btn-add) to be clicked and calls the functions that add players once it is called. 
	$('#add_players').on('click', '#btn-add', function(){
		var toAdd = $('input[name=playerNameInput]').val();
		addPlayer(toAdd);
		$('input[name=playerNameInput]').val('');  //resets the input box to blank
	});
	
	$('#scoringRoundScreen').on('click', '#next_btn', function(){
		scoreRound(isTeamGame());
	});

	$('#players').on('click', '.remove-btn', function(){
		var playerNumber = event.target.id.replace('remove-btn-','');
		removePlayer(playerNumber);
	});
	
	$('#players').on('click', '#rand-dealer-btn', function(){
		randDealer();
	});
	
	$('#players').on('change', '#teams-flip', function(){
		toggleTeams();
	});
});
