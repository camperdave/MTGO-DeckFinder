var total_cost_to_finish = 0;

function processCardArchClosure(cards) {
	return (function processCardArch(index, element) {
		parent = $(this).parent().parent();
		children = parent.children();

		quantity = $.trim($(children[0]).text());
		name = $.trim($(children[1]).text());
		price = $.trim($(children[3]).text());
		num_quantity = parseInt(quantity);
		if(cards[name] != null) {
			var missing = num_quantity - cards[name];
			cards[name] -= (num_quantity - missing);
		}
		else {
			var missing = num_quantity;
		}
		if (missing > 0) {
			single_price = parseFloat(price.substring(1)) / num_quantity;
			cost_to_buy = single_price * missing;
			total_cost_to_finish += cost_to_buy;
			$(children[0]).text(quantity + " -> " + missing);
			$(children[3]).text(price + " -> " + missing + "x $" + (Math.round(single_price * 100) / 100) + " = $" + (Math.round(cost_to_buy * 100) / 100));
		}
		else {
			$(parent).css("text-decoration", "line-through");
		}
	})
}

function processCardBasicClosure(cards) {
	return (function processCardBasic(index, element) {
		parent = $(this).parent();

		children = parent.contents();

		quantity = $.trim($(children[0]).text());
		name = $.trim($(children[1]).text());
		price = $.trim($($(parent).parent().children()[2]).text());

		num_quantity = parseInt(quantity)
		if(cards[name] != null) {
			var missing = num_quantity - cards[name];
			cards[name] -= (num_quantity - missing);
		}
		else {
			var missing = num_quantity;
		}
		if (missing > 0) {
			single_price = parseFloat(price.substring(1)) / num_quantity;
			cost_to_buy = single_price * missing;
			total_cost_to_finish += cost_to_buy;
			$(children[0]).before(quantity + " -> " + missing);
			$(children[0]).remove();
			$($(parent).parent().children()[2]).text(price + " -> " + missing + "x $" + (Math.round(single_price * 100) / 100) + " = $" + (Math.round(cost_to_buy * 100) / 100));
		}
		else {
			$(parent).parent().css("text-decoration", "line-through");
		}
	})
}

chrome.extension.sendRequest({message: "GET_CSV"}, function(response) {
	csv_cards = $.csv2Dictionary(response.csv)
	have_cards = {}
	for(i = 0; i < csv_cards.length; i++) {
		card_line = csv_cards[i]
		if (have_cards[card_line["Card Name"]] == null) {
			have_cards[card_line["Card Name"]] = 0
		}
		have_cards[card_line["Card Name"]] += parseInt(card_line["Online"])
	}
	total_cost_to_finish = 0;
	if( $("h2:contains('Archetype Cards')").length > 0){
		processCardsArchGivenCSV = processCardArchClosure(have_cards)
		$("a.popular-card").each(processCardsArchGivenCSV);
		$("a.liked-card").each(processCardsArchGivenCSV);
		$("a.unused-card").each(processCardsArchGivenCSV);
		var htmlTotalCostToBuy = '<tr><td class="bold">Cost to Finish:</td><td id="mtgo-deckfinder-total-cost-to-buy">$' + (Math.round(total_cost_to_finish * 100) / 100) + '</td></tr>'; 
		$("td.bold:contains('Format')").parent().parent().append(htmlTotalCostToBuy);
	}
	else {
		processCardsBasicGivenCSV = processCardBasicClosure(have_cards);
		$("td.nowrap > a").each(processCardsBasicGivenCSV);
		var htmlTotalCostToBuy = '<tr><td align="center" class="bold" colspan="2" id="mtgo-deckfinder-total-cost-to-buy">Cost to Finish: $' + (Math.round(total_cost_to_finish * 100) / 100) + '</td></tr>'; 
		$("td.bold:contains('Main Deck')").parent().parent().append(htmlTotalCostToBuy);
	}

});

