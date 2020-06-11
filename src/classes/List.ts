
interface ListNode<T> {
    nxt: ListNode<T> | any;
    data: T | any;
    priority: number;
}

class List<T> {
    head: ListNode<T>;
    tail: ListNode<T>;
    count = 0;
    minPriority: number;
    maxPriority: number;

    constructor() { }

    addLast(data: T | any, priority = 0) {
        this.updatePriority(priority);
        let node: ListNode<T> = { nxt: undefined, data: data, priority: priority };
        if (this.tail === undefined || this.head === undefined) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.nxt = node;
            this.tail = node;
        }
        this.count++;
    }

    addFirst(data: T | any, priority = 0) {
        this.updatePriority(priority);
        let node: ListNode<T> = { nxt: undefined, data: data, priority: priority };
        if (this.tail === undefined || this.head === undefined) {
            this.head = node;
            this.tail = node;
        } else {
            node.nxt = this.head;
            this.head = node;
        }
        this.count++;
    }

    updatePriority(priority: number) {
        if (!this.maxPriority && !this.minPriority) {
            this.maxPriority = priority;
            this.minPriority = priority;
        } else {
            if (priority < this.minPriority) this.minPriority = priority;
            if (priority > this.maxPriority) this.maxPriority = priority;
        }
    }

    addByPriority(data: T | any, priority: number) {
        let node: ListNode<T> = { nxt: undefined, data: data, priority: priority };
        if (this.head === undefined || this.tail === undefined) {
            this.head = node;
            this.tail = node;
        } else if (node.priority > this.head.priority) {
            node.nxt = this.head;
            this.head = node;
        } else {
            let current = this.head;
            while (current.nxt !== undefined) {
                if (node.priority >= current.nxt.priority) {
                    node.nxt = current.nxt;
                    current.nxt = node;
                    break;
                }
                current = current.nxt;
            }
            if (current.nxt === undefined) {
                this.tail.nxt = node;
                this.tail = node;
            }
        }
        this.count++;
    }

    addListByPriority(list: List<T>) {
        let current = list.head;
        while (current) {
            this.addByPriority(current.data, current.priority);
            current = current.nxt;
        }
    }

    remove() {
        if (this.head !== undefined && this.head !== null) {
            if (this.head == this.tail) {
                this.tail = undefined;
            }
            this.head = this.head.nxt;
            this.count--;
        }
    }

    linkLast(list: List<T>) {
        if (list.tail !== undefined) {
            if (this.tail !== undefined) {
                this.tail.nxt = list.head;
                this.tail = list.tail;
                this.count += list.count;
            } else {
                this.head = list.head;
                this.tail = list.tail;
                this.count = list.count;
            }
            if (list.maxPriority > this.maxPriority) this.maxPriority = list.maxPriority;
            if (list.minPriority > this.minPriority) this.minPriority = list.minPriority;
        }
    }

    linkFirst(list: List<T>) {
        if (list.tail !== undefined) {
            if (this.head !== undefined) {
                list.tail.nxt = this.head;
                this.head = list.head;
                this.count += list.count;
            } else {
                this.head = list.head;
                this.tail = list.tail;
                this.count = list.count;
            }
            if (list.maxPriority > this.maxPriority) this.maxPriority = list.maxPriority;
            if (list.minPriority > this.minPriority) this.minPriority = list.minPriority;
        }
    }

    copy() {
        let copy = new List<T>();
        let current = this.head;
        while (current) {
            let data = (typeof current.data.copy !== 'undefined' ? current.data.copy() : current.data);
            copy.addLast(data, current.priority);
            current = current.nxt;
        }
        return copy;
    }
}