function processCardArchClosure(cards) {
	return (function processCardArch(index, element) {
		parent = $(this).parent().parent()
		children = parent.children()

		quantity = $.trim($(children[0]).text())
		name = $.trim($(children[1]).text())
		price = $.trim($(children[3]).text())
		num_quantity = parseInt(quantity)
		if(cards[name] != null) {
			var missing = num_quantity - cards[name]
		}
		else {
			var missing = num_quantity
		}
		if (missing > 0) {
			single_price = parseFloat(price.substring(1)) / num_quantity
			cost_to_buy = single_price * missing
			$(children[0]).text(quantity + " -> " + missing)
			$(children[3]).text(price + " -> " + missing + "x $" + single_price + " = $" + (Math.round(cost_to_buy * 100) / 100))
		}
		else {
			$(parent).css("text-decoration", "line-through");
		}
	})
}

function processCardBasicClosure(cards) {
	return (function processCardBasic(index, element) {
		parent = $(this).parent()

		children = parent.contents()

		quantity = $.trim($(children[0]).text())
		name = $.trim($(children[1]).text())
		price = $.trim($($(parent).parent().children()[2]).text())

		num_quantity = parseInt(quantity)
		if(cards[name] != null) {
			var missing = num_quantity - cards[name]
		}
		else {
			var missing = num_quantity
		}
		if (missing > 0) {
			single_price = parseFloat(price.substring(1)) / num_quantity
			cost_to_buy = single_price * missing
			$(children[0]).before(quantity + " -> " + missing)
			$(children[0]).remove()
			$($(parent).parent().children()[2]).text(price + " -> " + missing + "x $" + single_price + " = $" + (Math.round(cost_to_buy * 100) / 100))
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

	if( $(".popular-card").length > 0){
		processCardsArchGivenCSV = processCardArchClosure(have_cards)

		$(".popular-card").each(processCardsArchGivenCSV)
		$(".liked-card").each(processCardsArchGivenCSV)
		$(".unused-card").each(processCardsArchGivenCSV)
	}
	else {
		processCardsBasicGivenCSV = processCardBasicClosure(have_cards)
		$("td.nowrap > a").each(processCardsBasicGivenCSV)
	}

});

