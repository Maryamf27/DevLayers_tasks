let tasks = [];

// Getting Element References
const form = document.getElementById('taskForm');
const input = document.getElementById('fileInput');
const list = document.getElementById('taskList');
const filter = document.getElementById('filter');
const search = document.getElementById('search');
const statusText = document.getElementById('status');

// To save tasks in Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// To load tasks from Local Storage or fetch sample tasks
function loadTasks() {
    const data = localStorage.getItem('tasks');
    if (data) {
        tasks = JSON.parse(data);
        renderTasks(tasks);
    } else {
        fetchSampleTasks();
    }
}
async function fetchSampleTasks() {
    statusText.innerText = 'Loading tasks...';
    try {
        // Fetching from public API for sample tasks
        const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
        // converting response to JSON
        const data = await res.json();


        tasks = data.map(item => ({
            id: Date.now() + Math.random(),
            title: item.title,
            completed: item.completed
        }));


        saveTasks();
        renderTasks(tasks);
        statusText.innerText = '';
    } catch (error) {
        statusText.innerText = 'Failed to load tasks';
    }
}
function renderTasks(taskArray) {
    list.innerHTML = '';

    taskArray.forEach(task => {
        const li = document.createElement('li');

        // Create elements
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;

        const span = document.createElement('span');
        span.textContent = task.title;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';

        // Append elements to li
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        // Checkbox event to toggle completed
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks(tasks);
        });

        // Delete event
        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks(tasks);
        });

        // Edit event
        editBtn.addEventListener('click', () => {
            // Replace span with input
            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.title;

            // Replace span with input
            li.replaceChild(input, span);
            input.focus();

            // When user presses Enter or leaves the input, save
            function saveEdit() {
                const newTitle = input.value.trim();
                if (newTitle === '') {
                    alert('Task cannot be empty');
                    input.focus();
                    return;
                }
                if (tasks.some(t => t.title === newTitle && t.id !== task.id)) {
                    alert('Duplicate task');
                    input.focus();
                    return;
                }
                task.title = newTitle;
                saveTasks();
                renderTasks(tasks);
            }

            input.addEventListener('blur', saveEdit);
            //When the input loses focus (blur), save the edit.
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
                if (e.key === 'Escape') {
                    renderTasks(tasks); // cancel edit on Escape
                }
            });
        });

        list.appendChild(li);
    });
}



form.addEventListener('submit', function (e) {
    e.preventDefault();


    const text = input
    if (text === '') {
        alert('Task cannot be empty');
        return;
    }


    if (tasks.some(t => t.title === text)) {
        alert('Duplicate task');
        return;
    }
    tasks.push({
        id: Date.now(),
        title: text,
        completed: false
    });

    const file = fileInput.files[0];
    if (file) {
        const fileInfo = document.createElement('p');
        fileInfo.textContent = `Attached file: ${file.name} (${file.size} bytes)`;
        list.appendChild(fileInfo);
    }
    if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '200px';
        list.appendChild(img);
    }
    if (file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.src = url;
        video.style.maxWidth = '200px';
        list.appendChild(video);
    }
    else if (file.type.startsWith("pdf/")) {

        const pdf = document.createElement("embed");
        pdf.src = url;
        pdf.width = "200";
        pdf.height = "200";
        li.appendChild(pdf);
        list.appendChild(li);
    }
    else {

        const download = document.createElement("a");
        download.href = url;
        download.textContent = "Download file";
        download.download = file.name;
        li.appendChild(download);
        list.appendChild(li);

    }


    saveTasks();
    renderTasks(tasks);
    input.value = '';
});


filter.addEventListener('change', () => {
    if (filter.value === 'completed') {
        renderTasks(tasks.filter(t => t.completed));
    } else if (filter.value === 'pending') {
        renderTasks(tasks.filter(t => !t.completed));
    } else {
        renderTasks(tasks);
    }
});
search.addEventListener('input', () => {
    const value = search.value.toLowerCase();
    renderTasks(tasks.filter(t => t.title.toLowerCase().includes(value)));
});


loadTasks();
