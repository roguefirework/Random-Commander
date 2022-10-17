cardName = document.getElementById('iCardName');
oracleText = document.getElementById('iOracleText');
powerToughness = document.getElementById("iPowerToughness");
cardImage = document.getElementById("iCardImage");
typeLine = document.getElementById("iTypeLine");
creatureTypeInput =  document.getElementById("iCreatureType");
scryfallUrl = "https://scryfallproxy.atticuspak.repl.co/random/is:commander "
// Display promise errors
cardFace = 0;
cardFaces = 1;
isFlipCard = false;//True if the card is an old kamigawa one sided flip card 
displayedCard = null;


const getFlipData = async (card,side) => {
	newCard = card.card_faces[side]
	card.oracle_text = newCard.oracle_text;
	card.power = newCard.power;
	card.toughness = newCard.toughness;
	card.name = newCard.name;
	card.type_line = newCard.type_line;
	return card;
}

const handleErrors = (err) => {
	console.log(err);
};

const fetchCard = async () => {
	searchTerm = scryfallUrl;
	if(creatureTypeInput.value != "")
	{

		searchTerm += "type:"+creatureTypeInput.value
	}
	
	
	const request = await fetch(searchTerm);

	const card = await request.json();
	return card;
};

// If card is not legal, get new card
const checkCommanderLegality = async (card) => {
	if (card.legalities.commander === 'not_legal') {
		getNewCard();
	};
};

const renderCard = async (card) => {
	
    cardName.innerText = card.name;
    oracleText.innerText = card.oracle_text;
	if(card.power != undefined)
	{
	    powerToughness.innerText = card.power + "/" + card.toughness;
	}
	else if(card.loyalty != undefined)
	{
		powerToughness.innerText = card.loyalty;
	}
	else
	{
		powerToughness.innerText = "";
	}
	cardImage.src = card.image_uris.png;
	typeLine.innerText = card.type_line;
}


const getNewCard = async () => {
	cardImage.style.transform = 'rotate(0deg)';
	cardFace = 0;
	const card = await fetchCard().catch(handleErrors);

	if(card.object != "card")
	{
		alert("Something went wrong: "+card.details)
		return;
	}
	displayedCard = card;
	
	await checkCommanderLegality(card);
	if(card.image_uris != undefined)
	{
		if(card.card_faces == undefined)
		{
			await renderCard(card);
			isFlipCard = false;
		}
		else
		{
			await renderCard(await getFlipData(card,cardFace));
			isFlipCard = true;
		}
		cardFaces = 1;
	}
	else
	{
		await renderCard(card.card_faces[cardFace]);
		cardFaces = 2;
		isFlipCard = false;
	}
}
const flipCard = async () => {
	if(cardFace ==0)
	{
		cardFace = 1
	}
	else
	{
		cardFace = 0
	}
	if(cardFaces == 1)
	{
		if(isFlipCard)
		{
			console.log(cardFace)
			await renderCard(await getFlipData(displayedCard,cardFace));
			if(cardFace == 1)
			{
				cardImage.style.transform = "rotate(180deg)"
			}
			else
			{
				cardImage.style.transform = "rotate(0deg)"
			}
		}
		else
		{
			if(cardFace == 1)
			{
				await renderCard(displayedCard);
			}
			else
			{
				cardImage.src = "cardback.png"
			}
		}
	}
	else
	{
		await renderCard(displayedCard.card_faces[cardFace])
	}
}

getNewCard();