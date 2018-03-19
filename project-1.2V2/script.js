function removeItemFromArray(array, item, index = undefined) {
    if (array.length == 0)
        return;

    if (!index) {
        index = array.indexOf(item);
    }

    if (index < 0) {
        return;
    }

    array.splice(index, 1);
}

function scrollTodoIntoView(id) {
    const item = viewModel.getListItem(id);

    if (item) {
        item.scrollIntoView();
    }
}