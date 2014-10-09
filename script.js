$(document).ready(function(){
	/********************************************************************************/
	/*********************************To Do List*************************************/
	// Features to add: 
	//					Teams radio button
	//					Individual bets for Teams
	//					Hand counter
	//					Randomizer for dealer
	//					Alert current scores after round
	/********************************************************************************/
	
	/********************************Global Variables********************************/
	var playerArray = [];
	var round = 1;
	
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
	var addPlayer = function(name){
		if(playerArray.length > 5){
			alert("Sorry, you've reached the max number of players.");
		}
		else{
			if (name == ''){
				alert("Please put enter a valid name.");
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
	var addPlayerToGameScreen = function(player){
		if($('[name="teams-flip"]').is(':checked')){
			$('#gameScreen').append('<div class="ui-block-a '+player.playerNumber+'" style="width:40%; padding: .5em; font-size: large;">' + player.name + '<div>');
			$('#gameScreen').append('<div class="ui-block-b '+player.playerNumber+'" style="width:30%; padding: .5em;">' + '<input type="number" data-role="none" min="0" max="12" style ="width:3em" name="' + player.playerNumber + 'A-Bet">' + '<input type="number" data-role="none" min="0" max="12" style ="width:3em" name="' + player.playerNumber + 'B-Bet">' + '</div>');		
			$('#gameScreen').append('<div class="ui-block-c '+player.playerNumber+'" style="width:30%; padding: .5em;">' + '<input type="checkbox" data-role="none" name="' + player.playerNumber + 'Check">' + '</div>');
		}
		else{
		$('#gameScreen').append('<div class="ui-block-a '+player.playerNumber+'" style="width:40%; padding: .5em; font-size: large;">' + player.name + '<div>');
		$('#gameScreen').append('<div class="ui-block-b '+player.playerNumber+'" style="width:30%; padding: .5em;">' + '<input type="number" data-role="none" min="0" max="12" style ="width:3em" name="' + player.playerNumber + 'Bet">' + '</div>');		
		$('#gameScreen').append('<div class="ui-block-c '+player.playerNumber+'" style="width:30%; padding: .5em;">' + '<input type="checkbox" data-role="none" name="' + player.playerNumber + 'Check">' + '</div>');
		}
	};

	//This function adds the player to the score screen Assigning the ID to the playerID.
	var addPlayerToScoreScreen = function(player){
		$('#player_col').append('<td class ="'+player.playerNumber+'" id="' + player.playerNumber + '"><b>' + player.name + '</b></td>');
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
	
	/****************************Scoring System Function****************************/
	var scoreRound = function(){
		$('#scores_table').append('<tr id="round' + round +'">' + '<td>' + round + '</td>');
		for(var x=0;x < playerArray.length;x++){
			var bet = parseInt($('input[name=' + playerArray[x].playerNumber + 'Bet]').val(), 10);
			//assume empty bets are 0
			bet = isNaN(bet) ? 0 : bet ;
			var happy = $('input[name=' + playerArray[x].playerNumber + 'Check]').is(':checked');
			if(happy === true){
				playerArray[x].score = playerArray[x].score + 10 + bet;
				$('input[name=' + playerArray[x].playerNumber + 'Bet]').val('');
				$('input[name=' + playerArray[x].playerNumber + 'Check]').prop("checked", false);
				$('#round' + round).append('<td>' + playerArray[x].score + '</td>');
				//alert(playerArray[x].score);
			}
			else{
				playerArray[x].score = playerArray[x].score - bet;
				$('input[name=' + playerArray[x].playerNumber + 'Bet]').val('');
				$('#round' + round).append('<td style="color:red;">' + playerArray[x].score + '</td>');
				//alert(playerArray[x].score);
			}
		};	
		$('#scores_table').append('</tr>');
		round += 1;
	};
	
	var scoreTeamsRound = function(){
		$('#scores_table').append('<tr id="round' + round +'">' + '<td>' + round + '</td>');
		for(var x=0;x < playerArray.length;x++){
			var bet1 = parseInt($('input[name=' + playerArray[x].playerNumber + 'A-Bet]').val(), 10);
			var bet2 = parseInt($('input[name=' + playerArray[x].playerNumber + 'B-Bet]').val(), 10);
			//assume empty bets are 0
			bet1 = isNaN(bet1) ? 0 : bet1;
			bet2 = isNaN(bet2) ? 0 : bet2;
			var totalBet = bet1 + bet2;
			
			var happy = $('input[name=' + playerArray[x].playerNumber + 'Check]').is(':checked');
			if(happy === true){
				playerArray[x].score = playerArray[x].score + 10 + totalBet;
				$('input[name=' + playerArray[x].playerNumber + 'Bet]').val('');
				$('input[name=' + playerArray[x].playerNumber + 'Check]').prop("checked", false);
				$('#round' + round).append('<td>' + playerArray[x].score + '</td>');
				//alert(playerArray[x].score);
			}
			else{
				playerArray[x].score = playerArray[x].score - totalBet;
				$('input[name=' + playerArray[x].playerNumber + 'Bet]').val('');
				$('#round' + round).append('<td style="color:red;">' + playerArray[x].score + '</td>');
				//alert(playerArray[x].score);
			}
		};	
		$('#scores_table').append('</tr>');
		round += 1;
	};
	
	/********************************JQuery Functions*******************************/
	//This function listens for the add button (id of btn-add) to be clicked and calls the functions that add players once it is called. 
	$('#add_players').on('click', '#btn-add', function(){
		var toAdd = $('input[name=playerNameInput]').val();
		addPlayer(toAdd);
		$('input[name=playerNameInput]').val('');  //resets the input box to blank
	});
	
	//This function listens for the Next Round button (id: sbmt_rnd) to be clicked and starts the scoring once it has
	$('#scoringRoundScreen').on('click', '#next_btn', function(){
		if($('[name="teams-flip"]').is(':checked')){
			scoreTeamsRound();
		}
		else{
			scoreRound();
		}
	});

	$('#players').on('click', '.remove-btn', function(){
		var playerNumber = event.target.id.replace('remove-btn-','');
		removePlayer(playerNumber);
	});
});