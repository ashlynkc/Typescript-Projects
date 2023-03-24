import ListItem from './ListItem'

interface List {

    list: ListItem[],
    load(): void,
    save(): void,
    clearList(): void,
    addItem(itemObj: ListItem): void,
    removeItem(id: string): void,

}

export default class FullList implements List {

    // This is a "singleton." There will only be one instance of this class created.
    static instance: FullList = new FullList
    
    private constructor (private _list: ListItem[] = []){}

    get list(): ListItem[] {

        return this._list

    }

    load(): void {

        const storedList: string | null = localStorage.getItem("myList")

        // We stringified the list (in the save method) so, if this isn't what we expected, return.
        if (typeof storedList !== "string") return

        // We are providing the type
        const parsedList: {_id: string, _item: string, _checked: boolean} []
        = JSON.parse(storedList)

        parsedList.forEach(itemObj => {

            // Given the item object we receieve, create a new list item and send that into
            // this instance of the list.
            const newListItem = new ListItem(itemObj._id, itemObj._item, itemObj._checked)
            FullList.instance.addItem(newListItem)

        })

    }

    save(): void {

        // Here we store list items in the local storage so the list persists when we refresh.
        localStorage.setItem("myList", JSON.stringify(this._list))

    }

    clearList(): void {

        // Emptying the list, then re-saving so the old items don't reload in.
        this._list = []
        this.save()

    }

    addItem(itemObj: ListItem): void {
        
        // Pushes an item (our itemObj recieved) onto the list, and saves.
        this._list.push(itemObj)
        this.save()

    }

    removeItem(id: string): void {
        
        // "Filter" is taking in the list of items, and checking that this item.id does not 
        // equal id (which is what we want removed). Keeping everything in the list
        // except for items with that id.
        this._list = this._list.filter(item => item.id !== id)
        this.save()
        
    }


}