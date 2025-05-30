export const question = (() => {

    const questionInput = document.getElementById('rule-question');
    const questionButton = document.getElementById('ask-rule-button');
    const questionResponses = document.getElementById('question-responses');

    const setupQuestion = () =>{
        questionButton.addEventListener('click', ()=>{
            const q = questionInput.value;
            questionInput.value = '';
            fetch('/search', {
                method:'POST', 
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({question:q, game:"echos_of_aletheia"})
            })
            .then(res=>res.json())
            .then(res=>{
                console.log(res)
                const answer = document.createElement('div');
                answer.id = new Date().getTime();
                answer.classList.add('answer');
                
                answer.innerHTML = res.answer.content;

                questionResponses.appendChild(answer)
            });
        });
    }

    return {
        setupQuestion,
    };
})();