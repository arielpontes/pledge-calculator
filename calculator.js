var brackets = [
    [53000000, 0.5],
    [11000000, 0.333],
    [2000000, 0.25],
    [480000, 0.2],
    [320000, 0.15],
    [140000, 0.1],
    [81000, 0.05],
];

function toIntDollars(country, income) {
    return income / countries[country]["ratio"];
}

function calculatePledge(country, income, index) {
    console.log(`calculatePledge(US, ${income}, ${index})`);

    if (income < 40000) {
        return 0;
    } else if (income >= 40000 && income <= 81000) {
        console.log(`1% of ${income} (${0.01 * income})`);
        return 0.01 * income;
    }

    var bracket = brackets[index];
    var boundary = bracket[0];
    var percent = bracket[1];
    var rest = income - boundary;

    if (rest > 0) {
        console.log(`${percent}% of ${rest} (${percent * rest})`);
        return (percent * rest) + calculatePledge(country, income - rest, index);
    } else {
        return calculatePledge(country, income, index + 1);
    }
}

$(document).ready(function () {
    $.each(countries, function (key, info) {
        $('#country-select').append(
            `<option value="${key}">${info['name']}</option >`
        );
    });
    $('#country-select').formSelect();
    $('#calculate').click(function () {
        var country = $('#country-select').val();
        var currency = countries[country]['currency'];
        var income = toIntDollars(country, parseInt($('#income').val()));
        var yearlyDonation = Math.round(calculatePledge(country, income, 0));
        var monthlyDonation = Math.round(yearlyDonation / 0.12) / 100;
        var percent = Math.round(1000 * (yearlyDonation / income)) / 10;

        var recommendation = `We recommend giving <span class="donation">
        ${yearlyDonation} ${currency}</span> (${percent}%). That's only
        <span class="donation">${monthlyDonation} ${currency}</span> each month.`;
        $('#recommendation').html(recommendation);
    });
});
