'use strict';

let allHorns = [];
const keywords = [];
let dataFile = './data/page-1.json';

// An object constructor accepting "horn" as a parameter 
// Stores the created instance in the 'allHorns' array
function Horn(horn) {
    this.image_url = horn.image_url;
    this.title = horn.title;
    this.description = horn.description;
    this.keyword = horn.keyword;
    this.horns = horn.horns;

    allHorns.push(this);
};

// A prototype that gets html content of #photo-template
// It creates section element as a jQuery variable
// It populates html content with an object instance property values
// Lastly, it appends the new section content to the main element
Horn.prototype.render = function () {
    const myTemplate = $('#photo-template').html();
    const $newSection = $('<section></section>');
    $newSection.html(myTemplate);

    $newSection.attr('class', this.keyword);
    $newSection.addClass('horn');
    $newSection.find('h2').text(this.title);
    $newSection.find('img').attr('src', this.image_url);
    $newSection.find('p').text(this.description);

    $('main').append($newSection);
};


// find all the keywords in allHorns
const getKeywords = (arr) => {
    arr.forEach(horn => {
        if (!keywords.includes(horn.keyword)) {
            keywords.push(horn.keyword);
        }
    })
}

// render the select list based on keywords available
const fillSelect = () => {
    keywords.forEach(keyword => {
        const $newOption = $('<option></option>');
        $newOption.text(keyword);
        $newOption.attr('class', 'horn');
        $newOption.attr('value', keyword);
        $('select').append($newOption);
    })
}


// do the show/hide when user makes a selection
const handleFilter = () => {
    $('select').on('change', function () {
        let selected = $(this).val();

        if (selected !== 'defalut') {
            $('section').hide();
            $(`section.${selected}`).fadeIn();
        }
    })
    // TODO: make this handle the default value again with an if statement
}


// Ajax calls to get data from page-1.json
// Uses Horn object constructor to create object instances
// Uses render prototype to display images as the instances are created

const loadHorns = (parameter) => {

    $.get(parameter, data => {
        data.forEach(horn => {
            let tempHorn = new Horn(horn);
            tempHorn.render();
        });
        getKeywords(allHorns);
        fillSelect();
        handleFilter();
    });

};

// initial load of data from first JSON file
loadHorns(dataFile);


// event handler re-renders page when user clicks for a different set of data
$('button').click(function () {
    const detatchedOptions = $('option.horn').detach();
    const detatchedSections = $('section.horn').detach();

    allHorns = [];

    dataFile = this.value;
    console.log(dataFile);

    loadHorns(dataFile);

    // console.log(detatchedOptions);
})


// remove existing sections from the page
// remove existing options from the select list
// get some data from the button/link about which set of images it wants.
// TODO: stretch: change classes of buttons so one is disabled when active