function lookupWord() {
    const form = document.getElementById("form-dictionary");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const word = data.get("word");
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => {
                const structuredData = {
                    word: data[0].word,
                    phonetic: data[0].phonetic,
                    audio: data[0].phonetics[0]?.audio || '',
                    meanings: data[0].meanings.map(meaning => ({
                        partOfSpeech: meaning.partOfSpeech,
                        definitions: meaning.definitions,
                    })),
                };
                const template = document.getElementById('results-template').innerText;
                const compiledFunction = Handlebars.compile(template);
                document.getElementById('results-dictionary').innerHTML = compiledFunction(structuredData);
            });
    });
}

function lookupSynonym() {
    const form = document.getElementById("form-synonym");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const word = data.get("word");
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => {
                const synonyms = data[0].meanings.flatMap(meaning => meaning.synonyms || []);
                const structuredData = {
                    word: data[0].word,
                    phonetic: data[0].phonetic || '',
                    synonyms: [...new Set(synonyms)]
                };
                const template = document.getElementById('results-synonyms-template').innerText;
                const compiledFunction = Handlebars.compile(template);
                document.getElementById('results-synonyms').innerHTML = compiledFunction(structuredData);
            });
    });
}

function lookupAntonym() {
    const form = document.getElementById("form-antonym");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const word = data.get("word");
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => {
                const antonyms = data[0].meanings.flatMap(meaning => meaning.antonyms || []);
                const structuredData = {
                    word: data[0].word,
                    phonetic: data[0].phonetic || '',
                    antonyms: [...new Set(antonyms)]
                };
                const template = document.getElementById('results-antonyms-template').innerText;
                const compiledFunction = Handlebars.compile(template);
                document.getElementById('results-antonyms').innerHTML = compiledFunction(structuredData);
            });
    });
}

function animateApp() {
    const app = document.getElementById('app');
    app.style.opacity = 0;
    setTimeout(() => {
        app.style.opacity = 1;
        app.style.transition = 'opacity 0.5s ease-in-out';
    }, 50);
}

window.addEventListener('load', () => {
    const app = $('#app');
    const dictionaryTemplate = Handlebars.compile($('#dictionary-template').html());
    const synonymTemplate = Handlebars.compile($('#synonym-template').html());
    const antonymTemplate = Handlebars.compile($('#antonym-template').html());

    const router = new Router({
        mode: 'hash',
        root: 'index.html',
        page404: (path) => {
            app.html(`<p>Page not found: ${path}</p>`);
        }
    });

    router.add('/dictionary', () => {
        animateApp();
        app.html(dictionaryTemplate());
        lookupWord();
    });

    router.add('/synonym', () => {
        animateApp();
        app.html(synonymTemplate());
        lookupSynonym();
    });

    router.add('/antonym', () => {
        animateApp();
        app.html(antonymTemplate());
        lookupAntonym();
    });

    router.addUriListener();

    $('a').on('click', (event) => {
        event.preventDefault();
        const href = $(event.target).attr('href');
        router.navigateTo(href.substring(href.lastIndexOf('/')));
    });

    // Load default content
    router.navigateTo('/');
});
