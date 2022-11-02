let CLUB = 0, DIAMOND = 1, HEART = 2, SPADE = 3;
let ACE = 14, JACK = 11, QUEEN = 12, KING = 13;
let RANK = 0, SUIT = 1, IMAGE = 2;

function generateDurakDeck()
{
	let deck = new Array();
	for (s = CLUB; s <= SPADE; s++)
		for (r = 6; r <= ACE; r++)
		{
			card=new Card(s, r);
			deck.push(card);
		}
	return deck;
}

function Card(chosenSuit, chosenRank)
{
	this.suit=chosenSuit;
	this.rank=chosenRank;
	this.image="./cardimages/"+chosenRank+"-"+chosenSuit+".png";
}

function CardDeck()
{
	//The deck is a simple array that will
	//be filled with Card objects.
	this.deck = new Array();
	//A series of functions will be used.
	this.peekCard = function(idx)
	{
		if (!idx)
		return this.deck[0];
			
		return this.deck[idx];
	}
	
	this.isEmpty = function()
	{
		return this.deck.length == 0;
	}
	
	this.getNumCards = function()
	{
		return this.deck.length;
	}
	
	this.removeCard = function (idx)
	{
		return this.deck.splice(idx, 1)[0];
	}
	
	this.insertCard = function (c, idx)
	{
		if (!idx)
			this.deck.push(c);
		else
			this.deck.splice(idx, 0, c);
	}
	
	this.emptyDeck = function ()
	{
		this.deck.splice(0, this.deck.length);
	}
	
	this.shuffle = function ()
	{
		tmp = new Array();
		while (this.deck.length > 0)
		{
			cardIdx = parseInt(Math.random() * this.deck.length);
			tmp.push(this.removeCard(cardIdx));
		}
		
		this.deck = tmp;
	}
	
	this.dealCard = function ()
	{
		return this.removeCard(0);
	}
}
function display()
		{
			deckDisplay.innerHTML=durakDeck.getNumCards();
			while (playerHandImageArray.length!=0)
				playerHandElement.removeChild(playerHandImageArray[0]);//clears the hand
			while (computerHandImageArray.length!=0)
				computerHandElement.removeChild(computerHandImageArray[0]);
			while (battlefieldImageArray.length!=0)
				battlefield.removeChild(battlefieldImageArray[0]);
			removeUndefinedCards();
			var parameter=0;
			while (playerHandImageArray.length<playerHand.getNumCards())//rerenders the hand with appropriate onclicks
			{
				var newImg=document.createElement("img");
				newImg.setAttribute("onclick","playCard("+parameter+");");
				playerHandElement.appendChild(newImg);
				parameter++;
			}
			while (computerHandImageArray.length<computerHand.getNumCards())
			{
				var newImg=document.createElement("img");
				computerHandElement.appendChild(newImg);
			}
			for (var i=0; i<playerHand.getNumCards(); i++)
				playerHandImageArray[i].src=playerHand.peekCard(i).image;
			for (var i=0; i<computerHand.getNumCards(); i++)
				computerHandImageArray[i].src="./cardimages/back-blue-75-2.png";
			while (battlefieldImageArray.length<battle.getNumCards())
			{
				var newImg=document.createElement("img");
				battlefield.appendChild(newImg);
			}
			for (var i=0; i<battle.getNumCards(); i++)
			{
				battlefieldImageArray[i].src=battle.peekCard(i).image;
				if (i%2==1)
					battlefieldImageArray[i].style.marginLeft='-20px';
				else
					battlefieldImageArray[i].style.marginLeft='20px';
			}
			if (battlefieldImageArray.length%2==1)
				userBtn.innerHTML="Take cards";
			else
				userBtn.innerHTML="End The Round";
			removeUndefinedCards();
			if (yourTurn)
				centerText.innerHTML="It is your turn!";
			else
				centerText.innerHTML="It is the computer's turn!";
			checkForVictor();
		}
		
		function dealHands()
		{
			playerHand=new CardDeck();
			computerHand=new CardDeck();
			for (var i=0; i<6; i++)
			{
				playerHand.deck.push(durakDeck.dealCard());
				computerHand.deck.push(durakDeck.dealCard());
			}
			removeUndefinedCards(); //for test purposes when you start with a deck of less than 12 cards.
		}
		
		function playCard(handPosition)
		{
			battlefield.innerHTML="";
			if (battle.getNumCards()==0 || (yourTurn==false && playerHand.peekCard(handPosition).suit==battle.peekCard(battle.getNumCards()-1).suit &&playerHand.peekCard(handPosition).rank>battle.peekCard(battle.getNumCards()-1).rank && battle.peekCard(battle.getNumCards()-1).suit!=koser && playerHand.peekCard(handPosition).suit!=koser) || (playerHand.peekCard(handPosition).suit==koser && battle.peekCard(battle.getNumCards()-1).suit==koser && yourTurn==false && playerHand.peekCard(handPosition).rank>battle.peekCard(battle.getNumCards()-1).rank) || (playerHand.peekCard(handPosition).suit==koser && battle.peekCard(battle.getNumCards()-1).suit!=koser && yourTurn==false))
			{
				if (battle.getNumCards()%2==0 && battle.getNumCards()!=0)
					battlefield.innerHTML="You can't play that card now! Maybe you should try ending the round? <br /><br />";
				else
				{
					battle.deck.push(playerHand.removeCard(handPosition));
					if (yourTurn==true)
						opponentDefense();
					else
						opponentOffense();
					display();
					return;
				}
			}
			else
			{
				if (yourTurn==true)
				{
					for (var i=0; i<battle.getNumCards(); i++)
						if (battle.getNumCards()%2==0 && playerHand.peekCard(handPosition).rank==battle.peekCard(i).rank)
						{
							battle.deck.push(playerHand.removeCard(handPosition));
							display();
							opponentDefense();
							return;
						}
				}
				else
					battlefield.innerHTML="You can't play that card! If you can't beat it, press 'End The Round' to take all the cards here! <br /><br />";
			}
			battlefield.innerHTML="Stop trying to play cards that you CAN'T PLAY!<br /><br />";
			display();
		}
		
		function opponentDefense()
		{
			for (var i=0; i<computerHand.getNumCards(); i++)
			{
				if (battle.peekCard(battle.getNumCards()-1).suit!=koser && computerHand.peekCard(i).rank>battle.peekCard(battle.getNumCards()-1).rank && computerHand.peekCard(i).suit==battle.peekCard(battle.getNumCards()-1).suit)
				{
					battle.deck.push(computerHand.removeCard(i));
					display();
					return;
				}
				else
					if ((computerHand.peekCard(i).suit==koser && battle.peekCard(battle.getNumCards()-1).suit==koser && computerHand.peekCard(i).rank>battle.peekCard(battle.getNumCards()-1).rank) || (computerHand.peekCard(i).suit==koser && battle.peekCard(battle.getNumCards()-1).suit!=koser))
					{
						battle.deck.push(computerHand.removeCard(i));
						display();
						return;
					}
			}
			computerTakeCards();
		}
		
		function computerTakeCards()
		{
			battlefield.innerHTML="Opponent took the cards!";
			while (battle.getNumCards()>0)
				computerHand.deck.push(battle.dealCard());
			tookCards=true;
			roundEnd();
		}
		
		function roundEnd(beat)
		{
			if (WINNER==0)
			{
				battlefield.innerHTML="";
				if (!beat)
					yourTurn=true;
				else
				{
					if (battle.getNumCards()%2==1)
						while (battle.deck.length!=0)
							playerHand.deck.push(battle.dealCard());
					else
					{
						while(battle.getNumCards()!=0)
							beatPile.deck.push(battle.dealCard());
						yourTurn=!yourTurn;
					}
				}
				if (durakDeck.getNumCards()>0)
				{
					while(playerHand.getNumCards()<6)
							playerHand.deck.push(durakDeck.dealCard());
					while(computerHand.getNumCards()<6)
						computerHand.deck.push(durakDeck.dealCard());
				}
				
				beatenCardsCounter.innerHTML="BeatenCards ("+beatPile.getNumCards()+")";
				display();
				if (yourTurn==false && WINNER==0)
					computerTurn();
			}
			else
				initialize();
		}
		
		function computerTurn()
		{
			battle.deck.push(computerHand.removeCard(parseInt(Math.random()*computerHand.getNumCards())));
			tookCards=false;
			display();
		}
		
		function opponentOffense()
		{
			battlefield.innerHTML="";
			for (var i=0; i<computerHand.getNumCards(); i++)
				for (var d=0; d<battle.getNumCards(); d++)
				{
					if (computerHand.peekCard(i).rank==battle.peekCard(d).rank)
					{
						battle.deck.push(computerHand.removeCard(i));
						return;
					}
					else
						if (i==computerHand.getNumCards() && d==battle.getNumCards())
							roundEnd(true);
				}
		}
		
		function checkForVictor()
		{
			WINNER=0;
			if (durakDeck.isEmpty())
			{
				if (playerHand.isEmpty() && (yourTurn==false || tookCards==true))
					WINNER='Human Player';
				if (computerHand.isEmpty() && (yourTurn==true || tookCards==false))
					WINNER='Computer Player';
				if (computerHand.isEmpty() && playerHand.isEmpty())
				{
					centerText.innerHTML="It's a tie!";
					userBtn.innerHTML="Reset";
					centerText.style.fontSize="36pt";
					return;
				}
			}
			if (WINNER!=0)
			{
				centerText.innerHTML=WINNER+" wins!";
				centerText.style.fontSize="36pt";
				userBtn.innerHTML="Reset";
			}
			else
			{
				centerText.style.fontSize="16pt";
				return;
			}
		}
		
		function removeUndefinedCards()
		{
			for (var i=0; i<playerHand.getNumCards(); i++)
				if (playerHand.peekCard(i)===undefined)
					playerHand.removeCard(i);
			for (var i=0; i<computerHand.getNumCards(); i++)
				if (computerHand.peekCard(i)===undefined)
					computerHand.removeCard(i);
			for (var i=0; i<battle.getNumCards(); i++)
				if (battle.peekCard(i)===undefined)
					battle.removeCard(i);
		}
		
		function playgame()
		{
			durakDeck=new CardDeck();
			durakDeck.deck=generateDurakDeck();
			durakDeck.shuffle();
			yourTurn=true;
			tookCards="";
		
			playerHandElement=document.getElementById('playerHandDisplay');
			computerHandElement=document.getElementById('computerHandDisplay');
			playerHandImageArray=playerHandElement.getElementsByTagName('img');
			computerHandImageArray=computerHandElement.getElementsByTagName('img');
			deckDisplay=document.getElementById('count');
			document.getElementById('trump').src=durakDeck.peekCard(durakDeck.getNumCards()-1).image;
			koser=durakDeck.peekCard(durakDeck.getNumCards()-1).suit;
			battlefield=document.getElementById("right");
			centerText=document.getElementById("centerdeck");
			battlefieldImageArray=battlefield.getElementsByTagName('img');
			battle=new CardDeck();
			beatenCardsCounter=document.getElementById('beatencards');
			beatPile=new CardDeck();
			dealHands();
			userBtn=document.getElementById("btn");
			popup=document.getElementById('rules');
			popup.style.marginLeft=(screen.availWidth-500)/2+"px";
			display();
		}