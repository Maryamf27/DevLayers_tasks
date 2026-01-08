
function showProject(path) {
    const frame = document.getElementById('projectFrame');
    frame.src = path

    frame.scrollIntoView({
        behavior: 'smooth'
    })
}
