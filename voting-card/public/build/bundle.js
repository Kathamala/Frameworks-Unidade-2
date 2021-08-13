
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
    // at the end of hydration without touching the remaining nodes.
    let is_hydrating = false;
    function start_hydrating() {
        is_hydrating = true;
    }
    function end_hydrating() {
        is_hydrating = false;
    }
    function upper_bound(low, high, key, value) {
        // Return first index of value larger than input value in the range [low, high)
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (key(mid) <= value) {
                low = mid + 1;
            }
            else {
                high = mid;
            }
        }
        return low;
    }
    function init_hydrate(target) {
        if (target.hydrate_init)
            return;
        target.hydrate_init = true;
        // We know that all children have claim_order values since the unclaimed have been detached
        const children = target.childNodes;
        /*
        * Reorder claimed children optimally.
        * We can reorder claimed children optimally by finding the longest subsequence of
        * nodes that are already claimed in order and only moving the rest. The longest
        * subsequence subsequence of nodes that are claimed in order can be found by
        * computing the longest increasing subsequence of .claim_order values.
        *
        * This algorithm is optimal in generating the least amount of reorder operations
        * possible.
        *
        * Proof:
        * We know that, given a set of reordering operations, the nodes that do not move
        * always form an increasing subsequence, since they do not move among each other
        * meaning that they must be already ordered among each other. Thus, the maximal
        * set of nodes that do not move form a longest increasing subsequence.
        */
        // Compute longest increasing subsequence
        // m: subsequence length j => index k of smallest value that ends an increasing subsequence of length j
        const m = new Int32Array(children.length + 1);
        // Predecessor indices + 1
        const p = new Int32Array(children.length);
        m[0] = -1;
        let longest = 0;
        for (let i = 0; i < children.length; i++) {
            const current = children[i].claim_order;
            // Find the largest subsequence length such that it ends in a value less than our current value
            // upper_bound returns first greater value, so we subtract one
            const seqLen = upper_bound(1, longest + 1, idx => children[m[idx]].claim_order, current) - 1;
            p[i] = m[seqLen] + 1;
            const newLen = seqLen + 1;
            // We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.
            m[newLen] = i;
            longest = Math.max(newLen, longest);
        }
        // The longest increasing subsequence of nodes (initially reversed)
        const lis = [];
        // The rest of the nodes, nodes that will be moved
        const toMove = [];
        let last = children.length - 1;
        for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
            lis.push(children[cur - 1]);
            for (; last >= cur; last--) {
                toMove.push(children[last]);
            }
            last--;
        }
        for (; last >= 0; last--) {
            toMove.push(children[last]);
        }
        lis.reverse();
        // We sort the nodes being moved to guarantee that their insertion order matches the claim order
        toMove.sort((a, b) => a.claim_order - b.claim_order);
        // Finally, we move the nodes
        for (let i = 0, j = 0; i < toMove.length; i++) {
            while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
                j++;
            }
            const anchor = j < lis.length ? lis[j] : null;
            target.insertBefore(toMove[i], anchor);
        }
    }
    function append(target, node) {
        if (is_hydrating) {
            init_hydrate(target);
            if ((target.actual_end_child === undefined) || ((target.actual_end_child !== null) && (target.actual_end_child.parentElement !== target))) {
                target.actual_end_child = target.firstChild;
            }
            if (node !== target.actual_end_child) {
                target.insertBefore(node, target.actual_end_child);
            }
            else {
                target.actual_end_child = node.nextSibling;
            }
        }
        else if (node.parentNode !== target) {
            target.appendChild(node);
        }
    }
    function insert(target, node, anchor) {
        if (is_hydrating && !anchor) {
            append(target, node);
        }
        else if (node.parentNode !== target || (anchor && node.nextSibling !== anchor)) {
            target.insertBefore(node, anchor || null);
        }
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                start_hydrating();
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            end_hydrating();
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const voteList = writable([]);

    function createVoteList() {
      const { subscribe, update } = writable([]);

      function create() {
        const newVote = { 
          title: '', 
          options: [    {
            text: '',
            votes: 0
        }, 
        {   
            text: '',
            votes: 0
        }] 
      };
        update((list) => [...list, newVote]);
      }

      function change(vote, index) {
        update((list) => [
          ...list.slice(0, index),
          vote,
          ...list.slice(index + 1)
        ]);
      }

      function remove(index) {
        update((list) => [
          ...list.slice(0, index),
          ...list.slice(index + 1)
        ]);
      }

      return { subscribe, create, change, remove }
    }

    function minLengthValidation(minLength, value){
        if(value.trim().length < minLength){
            return `Este campo requer pelo menos ${minLength} caracteres`
        }

        return null
    }

    function requiredValidation(value){
        if(value.trim() === ''){
            return 'Este campo é obrigatório'
        }

        return null
    }

    function requiredIsANumber(value){
        if(isNaN(value) || value.toString().trim() === ''){
            return 'Este campo deve conter um valor numérico'
        }

        return null
    }

    function openOrClosed(value){
        if(value !== 'open' && value !== 'closed'){
            return 'Este campo deve conter [open] ou [closed] como resposta'
        }

        return null
    }

    /* src/components/Input.svelte generated by Svelte v3.38.3 */

    const file$5 = "src/components/Input.svelte";

    // (4:2) {#if isRequired}
    function create_if_block_1$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "*";
    			set_style(span, "color", "red");
    			add_location(span, file$5, 4, 2, 73);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(4:2) {#if isRequired}",
    		ctx
    	});

    	return block;
    }

    // (11:2) {:else}
    function create_else_block$2(ctx) {
    	let input;
    	let input_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", input_class_value = "" + (null_to_empty(/*error*/ ctx[5] ? "input-error" : "") + " svelte-v1berz"));
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[3]);
    			add_location(input, file$5, 11, 4, 284);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[11]),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[8], false, false, false),
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 32 && input_class_value !== (input_class_value = "" + (null_to_empty(/*error*/ ctx[5] ? "input-error" : "") + " svelte-v1berz"))) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*placeholder*/ 8) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[3]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(11:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:2) {#if type === 'textarea'}
    function create_if_block$2(ctx) {
    	let textarea;
    	let textarea_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "rows", "4");
    			attr_dev(textarea, "class", textarea_class_value = "" + (null_to_empty(/*error*/ ctx[5] ? "input-error" : "") + " svelte-v1berz"));
    			attr_dev(textarea, "placeholder", /*placeholder*/ ctx[3]);
    			add_location(textarea, file$5, 9, 2, 162);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[10]),
    					listen_dev(textarea, "input", /*input_handler*/ ctx[6], false, false, false),
    					listen_dev(textarea, "blur", /*blur_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 32 && textarea_class_value !== (textarea_class_value = "" + (null_to_empty(/*error*/ ctx[5] ? "input-error" : "") + " svelte-v1berz"))) {
    				attr_dev(textarea, "class", textarea_class_value);
    			}

    			if (dirty & /*placeholder*/ 8) {
    				attr_dev(textarea, "placeholder", /*placeholder*/ ctx[3]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(textarea, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(9:2) {#if type === 'textarea'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div2;
    	let label_1;
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let div0;
    	let t4_value = (/*error*/ ctx[5] || "") + "";
    	let t4;
    	let if_block0 = /*isRequired*/ ctx[4] && create_if_block_1$2(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[1] === "textarea") return create_if_block$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[2]);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div1 = element("div");
    			if_block1.c();
    			t3 = space();
    			div0 = element("div");
    			t4 = text(t4_value);
    			attr_dev(label_1, "for", "");
    			attr_dev(label_1, "class", "svelte-v1berz");
    			add_location(label_1, file$5, 1, 1, 25);
    			attr_dev(div0, "class", "error svelte-v1berz");
    			add_location(div0, file$5, 19, 4, 453);
    			add_location(div1, file$5, 7, 1, 126);
    			attr_dev(div2, "class", "form-item svelte-v1berz");
    			add_location(div2, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, label_1);
    			append_dev(label_1, t0);
    			append_dev(label_1, t1);
    			if (if_block0) if_block0.m(label_1, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			if_block1.m(div1, null);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 4) set_data_dev(t0, /*label*/ ctx[2]);

    			if (/*isRequired*/ ctx[4]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(label_1, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div1, t3);
    				}
    			}

    			if (dirty & /*error*/ 32 && t4_value !== (t4_value = (/*error*/ ctx[5] || "") + "")) set_data_dev(t4, t4_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Input", slots, []);
    	let { type = "input" } = $$props;
    	let { label = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { value = "" } = $$props;
    	let { isRequired = false } = $$props;
    	let { error = "" } = $$props;
    	const writable_props = ["type", "label", "placeholder", "value", "isRequired", "error"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("label" in $$props) $$invalidate(2, label = $$props.label);
    		if ("placeholder" in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("isRequired" in $$props) $$invalidate(4, isRequired = $$props.isRequired);
    		if ("error" in $$props) $$invalidate(5, error = $$props.error);
    	};

    	$$self.$capture_state = () => ({
    		type,
    		label,
    		placeholder,
    		value,
    		isRequired,
    		error
    	});

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("label" in $$props) $$invalidate(2, label = $$props.label);
    		if ("placeholder" in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("isRequired" in $$props) $$invalidate(4, isRequired = $$props.isRequired);
    		if ("error" in $$props) $$invalidate(5, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		type,
    		label,
    		placeholder,
    		isRequired,
    		error,
    		input_handler,
    		blur_handler,
    		input_handler_1,
    		blur_handler_1,
    		textarea_input_handler,
    		input_input_handler
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			type: 1,
    			label: 2,
    			placeholder: 3,
    			value: 0,
    			isRequired: 4,
    			error: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRequired() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRequired(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Form.svelte generated by Svelte v3.38.3 */

    const { Object: Object_1 } = globals;
    const file$4 = "src/components/Form.svelte";

    function create_fragment$4(ctx) {
    	let form;
    	let h2;
    	let t1;
    	let input0;
    	let updating_value;
    	let t2;
    	let input1;
    	let updating_value_1;
    	let t3;
    	let input2;
    	let updating_value_2;
    	let t4;
    	let input3;
    	let updating_value_3;
    	let t5;
    	let input4;
    	let updating_value_4;
    	let t6;
    	let input5;
    	let t7;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[7](value);
    	}

    	let input0_props = {
    		type: "textarea",
    		label: "Enunciado",
    		placeholder: "Digite o título da votação",
    		isRequired: "true",
    		error: /*errors*/ ctx[0]["title"]
    	};

    	if (/*vote*/ ctx[2].title !== void 0) {
    		input0_props.value = /*vote*/ ctx[2].title;
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	input0.$on("input", function () {
    		if (is_function(/*touched*/ ctx[1]["title"] = true)) (/*touched*/ ctx[1]["title"] = true).apply(this, arguments);
    	});

    	input0.$on("blur", /*blur_handler*/ ctx[8]);

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[9](value);
    	}

    	let input1_props = {
    		label: "Opção 1",
    		placeholder: "Digite a 1ª opção",
    		isRequired: "true",
    		error: /*errors*/ ctx[0]["option1"]
    	};

    	if (/*vote*/ ctx[2].option1 !== void 0) {
    		input1_props.value = /*vote*/ ctx[2].option1;
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));
    	input1.$on("input", /*input_handler*/ ctx[10]);
    	input1.$on("blur", /*blur_handler_1*/ ctx[11]);

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[12](value);
    	}

    	let input2_props = {
    		label: "Votes 1",
    		placeholder: "Digite a quantidade de votos da 1ª opção",
    		error: /*errors*/ ctx[0]["votes1"]
    	};

    	if (/*vote*/ ctx[2].votes1 !== void 0) {
    		input2_props.value = /*vote*/ ctx[2].votes1;
    	}

    	input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));
    	input2.$on("input", /*input_handler_1*/ ctx[13]);
    	input2.$on("blur", /*blur_handler_2*/ ctx[14]);

    	function input3_value_binding(value) {
    		/*input3_value_binding*/ ctx[15](value);
    	}

    	let input3_props = {
    		label: "Opção 2",
    		placeholder: "Digite a 2ª opção",
    		isRequired: "true",
    		error: /*errors*/ ctx[0]["option2"]
    	};

    	if (/*vote*/ ctx[2].option2 !== void 0) {
    		input3_props.value = /*vote*/ ctx[2].option2;
    	}

    	input3 = new Input({ props: input3_props, $$inline: true });
    	binding_callbacks.push(() => bind(input3, "value", input3_value_binding));
    	input3.$on("input", /*input_handler_2*/ ctx[16]);
    	input3.$on("blur", /*blur_handler_3*/ ctx[17]);

    	function input4_value_binding(value) {
    		/*input4_value_binding*/ ctx[18](value);
    	}

    	let input4_props = {
    		label: "Votes 2",
    		placeholder: "Digite a quantidade de votos da 2ª opção",
    		error: /*errors*/ ctx[0]["votes2"]
    	};

    	if (/*vote*/ ctx[2].votes2 !== void 0) {
    		input4_props.value = /*vote*/ ctx[2].votes2;
    	}

    	input4 = new Input({ props: input4_props, $$inline: true });
    	binding_callbacks.push(() => bind(input4, "value", input4_value_binding));
    	input4.$on("input", /*input_handler_3*/ ctx[19]);
    	input4.$on("blur", /*blur_handler_4*/ ctx[20]);

    	const block = {
    		c: function create() {
    			form = element("form");
    			h2 = element("h2");
    			h2.textContent = "Edita votação";
    			t1 = space();
    			create_component(input0.$$.fragment);
    			t2 = space();
    			create_component(input1.$$.fragment);
    			t3 = space();
    			create_component(input2.$$.fragment);
    			t4 = space();
    			create_component(input3.$$.fragment);
    			t5 = space();
    			create_component(input4.$$.fragment);
    			t6 = space();
    			input5 = element("input");
    			t7 = space();
    			button = element("button");
    			button.textContent = "Cancelar";
    			add_location(h2, file$4, 1, 1, 42);
    			attr_dev(input5, "type", "submit");
    			input5.value = "Atualizar";
    			add_location(input5, file$4, 46, 1, 1427);
    			attr_dev(button, "type", "button");
    			add_location(button, file$4, 47, 1, 1468);
    			add_location(form, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, h2);
    			append_dev(form, t1);
    			mount_component(input0, form, null);
    			append_dev(form, t2);
    			mount_component(input1, form, null);
    			append_dev(form, t3);
    			mount_component(input2, form, null);
    			append_dev(form, t4);
    			mount_component(input3, form, null);
    			append_dev(form, t5);
    			mount_component(input4, form, null);
    			append_dev(form, t6);
    			append_dev(form, input5);
    			append_dev(form, t7);
    			append_dev(form, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[21], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*submit*/ ctx[5]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const input0_changes = {};
    			if (dirty & /*errors*/ 1) input0_changes.error = /*errors*/ ctx[0]["title"];

    			if (!updating_value && dirty & /*vote*/ 4) {
    				updating_value = true;
    				input0_changes.value = /*vote*/ ctx[2].title;
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};
    			if (dirty & /*errors*/ 1) input1_changes.error = /*errors*/ ctx[0]["option1"];

    			if (!updating_value_1 && dirty & /*vote*/ 4) {
    				updating_value_1 = true;
    				input1_changes.value = /*vote*/ ctx[2].option1;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};
    			if (dirty & /*errors*/ 1) input2_changes.error = /*errors*/ ctx[0]["votes1"];

    			if (!updating_value_2 && dirty & /*vote*/ 4) {
    				updating_value_2 = true;
    				input2_changes.value = /*vote*/ ctx[2].votes1;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const input3_changes = {};
    			if (dirty & /*errors*/ 1) input3_changes.error = /*errors*/ ctx[0]["option2"];

    			if (!updating_value_3 && dirty & /*vote*/ 4) {
    				updating_value_3 = true;
    				input3_changes.value = /*vote*/ ctx[2].option2;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			input3.$set(input3_changes);
    			const input4_changes = {};
    			if (dirty & /*errors*/ 1) input4_changes.error = /*errors*/ ctx[0]["votes2"];

    			if (!updating_value_4 && dirty & /*vote*/ 4) {
    				updating_value_4 = true;
    				input4_changes.value = /*vote*/ ctx[2].votes2;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			input4.$set(input4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(input3.$$.fragment, local);
    			transition_in(input4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(input3.$$.fragment, local);
    			transition_out(input4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(input3);
    			destroy_component(input4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Form", slots, []);
    	let { votation } = $$props;

    	const validate = {
    		title: value => minLengthValidation(3, value),
    		option1: requiredValidation,
    		option2: requiredValidation,
    		votes1: requiredIsANumber,
    		votes2: requiredIsANumber
    	};

    	let errors = {};
    	let touched = {};
    	const dispatch = createEventDispatcher();
    	const { title, options } = votation || {};
    	const [{ text: option1, votes: votes1 }, { text: option2, votes: votes2 }] = options || [];
    	let vote = { title, option1, option2, votes1, votes2 };

    	function checkField(name) {
    		$$invalidate(0, errors[name] = "", errors);

    		if (validate[name] && touched[name]) {
    			const value = vote[name];
    			$$invalidate(0, errors[name] = validate[name](value) || "", errors);
    		}
    	}

    	function submit() {
    		Object.keys(vote).forEach(field => {
    			$$invalidate(1, touched[field] = true, touched);
    			checkField(field);
    		});

    		const errorsIsEmpty = !Object.values(errors).some(v => v);

    		if (errorsIsEmpty) {
    			const allOptions = [
    				{ text: vote.option1, votes: vote.votes1 },
    				{ text: vote.option2, votes: vote.votes2 }
    			];

    			dispatch("update", { title: vote.title, options: allOptions });
    		}
    	}

    	const writable_props = ["votation"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	function input0_value_binding(value) {
    		if ($$self.$$.not_equal(vote.title, value)) {
    			vote.title = value;
    			$$invalidate(2, vote);
    		}
    	}

    	const blur_handler = e => checkField("title");

    	function input1_value_binding(value) {
    		if ($$self.$$.not_equal(vote.option1, value)) {
    			vote.option1 = value;
    			$$invalidate(2, vote);
    		}
    	}

    	const input_handler = e => $$invalidate(1, touched["option1"] = true, touched);
    	const blur_handler_1 = e => checkField("option1");

    	function input2_value_binding(value) {
    		if ($$self.$$.not_equal(vote.votes1, value)) {
    			vote.votes1 = value;
    			$$invalidate(2, vote);
    		}
    	}

    	const input_handler_1 = e => $$invalidate(1, touched["votes1"] = true, touched);
    	const blur_handler_2 = e => checkField("votes1");

    	function input3_value_binding(value) {
    		if ($$self.$$.not_equal(vote.option2, value)) {
    			vote.option2 = value;
    			$$invalidate(2, vote);
    		}
    	}

    	const input_handler_2 = e => $$invalidate(1, touched["option2"] = true, touched);
    	const blur_handler_3 = e => checkField("option2");

    	function input4_value_binding(value) {
    		if ($$self.$$.not_equal(vote.votes2, value)) {
    			vote.votes2 = value;
    			$$invalidate(2, vote);
    		}
    	}

    	const input_handler_3 = e => $$invalidate(1, touched["votes2"] = true, touched);
    	const blur_handler_4 = e => checkField("votes2");
    	const click_handler = e => dispatch("cancel");

    	$$self.$$set = $$props => {
    		if ("votation" in $$props) $$invalidate(6, votation = $$props.votation);
    	};

    	$$self.$capture_state = () => ({
    		minLengthValidation,
    		requiredValidation,
    		requiredIsANumber,
    		openOrClosed,
    		createEventDispatcher,
    		Input,
    		votation,
    		validate,
    		errors,
    		touched,
    		dispatch,
    		title,
    		options,
    		option1,
    		votes1,
    		option2,
    		votes2,
    		vote,
    		checkField,
    		submit
    	});

    	$$self.$inject_state = $$props => {
    		if ("votation" in $$props) $$invalidate(6, votation = $$props.votation);
    		if ("errors" in $$props) $$invalidate(0, errors = $$props.errors);
    		if ("touched" in $$props) $$invalidate(1, touched = $$props.touched);
    		if ("vote" in $$props) $$invalidate(2, vote = $$props.vote);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		errors,
    		touched,
    		vote,
    		dispatch,
    		checkField,
    		submit,
    		votation,
    		input0_value_binding,
    		blur_handler,
    		input1_value_binding,
    		input_handler,
    		blur_handler_1,
    		input2_value_binding,
    		input_handler_1,
    		blur_handler_2,
    		input3_value_binding,
    		input_handler_2,
    		blur_handler_3,
    		input4_value_binding,
    		input_handler_3,
    		blur_handler_4,
    		click_handler
    	];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { votation: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*votation*/ ctx[6] === undefined && !("votation" in props)) {
    			console.warn("<Form> was created without expected prop 'votation'");
    		}
    	}

    	get votation() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set votation(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Booth.svelte generated by Svelte v3.38.3 */
    const file$3 = "src/components/Booth.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (1:0) {#each options as option, index (option)}
    function create_each_block$2(key_1, ctx) {
    	let button;
    	let t_value = /*option*/ ctx[2] + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "choices svelte-18cwls5");
    			add_location(button, file$3, 1, 4, 46);
    			this.first = button;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*dispatcher*/ ctx[1]("selected", /*index*/ ctx[4]))) /*dispatcher*/ ctx[1]("selected", /*index*/ ctx[4]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*options*/ 1 && t_value !== (t_value = /*option*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(1:0) {#each options as option, index (option)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*options*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*option*/ ctx[2];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dispatcher, options*/ 3) {
    				each_value = /*options*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block$2, each_1_anchor, get_each_context$2);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Booth", slots, []);
    	let { options } = $$props;
    	const dispatcher = createEventDispatcher();
    	const writable_props = ["options"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Booth> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		options,
    		dispatcher
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [options, dispatcher];
    }

    class Booth extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { options: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Booth",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[0] === undefined && !("options" in props)) {
    			console.warn("<Booth> was created without expected prop 'options'");
    		}
    	}

    	get options() {
    		throw new Error("<Booth>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Booth>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Result.svelte generated by Svelte v3.38.3 */

    const file$2 = "src/components/Result.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (1:0) {#each votes as option, index (option)}
    function create_each_block$1(key_1, ctx) {
    	let div;
    	let t0_value = /*index*/ ctx[5] + 1 + "";
    	let t0;
    	let t1;
    	let t2_value = /*option*/ ctx[3].text + "";
    	let t2;
    	let t3;
    	let t4_value = /*option*/ ctx[3].votes + "";
    	let t4;
    	let t5;
    	let t6_value = (/*option*/ ctx[3].votes / /*total*/ ctx[1] * 100).toFixed(0) + "";
    	let t6;
    	let t7;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text(". ");
    			t2 = text(t2_value);
    			t3 = text(" - ");
    			t4 = text(t4_value);
    			t5 = text(" votes (");
    			t6 = text(t6_value);
    			t7 = text("%)\n    ");
    			add_location(div, file$2, 1, 4, 44);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(div, t5);
    			append_dev(div, t6);
    			append_dev(div, t7);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*votes*/ 1 && t0_value !== (t0_value = /*index*/ ctx[5] + 1 + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*votes*/ 1 && t2_value !== (t2_value = /*option*/ ctx[3].text + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*votes*/ 1 && t4_value !== (t4_value = /*option*/ ctx[3].votes + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*votes, total*/ 3 && t6_value !== (t6_value = (/*option*/ ctx[3].votes / /*total*/ ctx[1] * 100).toFixed(0) + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(1:0) {#each votes as option, index (option)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*votes*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*option*/ ctx[3];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*votes, total*/ 3) {
    				each_value = /*votes*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Result", slots, []);
    	let { votes } = $$props;
    	let total = 0;

    	for (var i = 0; i < votes.length; i++) {
    		total += votes[i].votes;
    	}

    	const writable_props = ["votes"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Result> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("votes" in $$props) $$invalidate(0, votes = $$props.votes);
    	};

    	$$self.$capture_state = () => ({ votes, total, i });

    	$$self.$inject_state = $$props => {
    		if ("votes" in $$props) $$invalidate(0, votes = $$props.votes);
    		if ("total" in $$props) $$invalidate(1, total = $$props.total);
    		if ("i" in $$props) i = $$props.i;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [votes, total];
    }

    class Result extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { votes: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Result",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*votes*/ ctx[0] === undefined && !("votes" in props)) {
    			console.warn("<Result> was created without expected prop 'votes'");
    		}
    	}

    	get votes() {
    		throw new Error("<Result>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set votes(value) {
    		throw new Error("<Result>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Card.svelte generated by Svelte v3.38.3 */
    const file$1 = "src/components/Card.svelte";

    // (11:4) {:else}
    function create_else_block$1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Not found";
    			add_location(h1, file$1, 11, 8, 264);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(11:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:33) 
    function create_if_block_1$1(ctx) {
    	let result;
    	let current;

    	result = new Result({
    			props: { votes: /*votes*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(result.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(result, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const result_changes = {};
    			if (dirty & /*votes*/ 2) result_changes.votes = /*votes*/ ctx[1];
    			result.$set(result_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(result.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(result.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(result, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(9:33) ",
    		ctx
    	});

    	return block;
    }

    // (4:4) {#if state === "open"}
    function create_if_block$1(ctx) {
    	let booth;
    	let current;

    	booth = new Booth({
    			props: { options: /*boothOptions*/ ctx[3] },
    			$$inline: true
    		});

    	booth.$on("selected", /*onSelect*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(booth.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(booth, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(booth.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(booth.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(booth, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(4:4) {#if state === \\\"open\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[0] === "open") return 0;
    		if (/*state*/ ctx[0] === "closed") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[2]);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			if_block.c();
    			add_location(h1, file$1, 1, 4, 29);
    			add_location(br, file$1, 2, 4, 52);
    			attr_dev(div, "class", "votingCard svelte-5xosfu");
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 4) set_data_dev(t0, /*title*/ ctx[2]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Card", slots, []);
    	let { title } = $$props;
    	let { state } = $$props;
    	let { votes } = $$props;
    	const boothOptions = votes.map(option => option.text);

    	function onSelect(event) {
    		$$invalidate(0, state = "closed");
    		$$invalidate(1, votes[event.detail].votes++, votes);
    	}

    	const writable_props = ["title", "state", "votes"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("votes" in $$props) $$invalidate(1, votes = $$props.votes);
    	};

    	$$self.$capture_state = () => ({
    		Booth,
    		Result,
    		title,
    		state,
    		votes,
    		boothOptions,
    		onSelect
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("votes" in $$props) $$invalidate(1, votes = $$props.votes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [state, votes, title, boothOptions, onSelect];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { title: 2, state: 0, votes: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[2] === undefined && !("title" in props)) {
    			console.warn("<Card> was created without expected prop 'title'");
    		}

    		if (/*state*/ ctx[0] === undefined && !("state" in props)) {
    			console.warn("<Card> was created without expected prop 'state'");
    		}

    		if (/*votes*/ ctx[1] === undefined && !("votes" in props)) {
    			console.warn("<Card> was created without expected prop 'votes'");
    		}
    	}

    	get title() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get votes() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set votes(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/List.svelte generated by Svelte v3.38.3 */
    const file = "src/components/List.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (23:0) {:else}
    function create_else_block(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				votation: /*$vList*/ ctx[2][/*current*/ ctx[1]]
    			},
    			$$inline: true
    		});

    	form.$on("update", /*updateChanges*/ ctx[8]);
    	form.$on("cancel", /*cancelChanges*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};
    			if (dirty & /*$vList, current*/ 6) form_changes.votation = /*$vList*/ ctx[2][/*current*/ ctx[1]];
    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(23:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:30) 
    function create_if_block_2(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				title: /*$vList*/ ctx[2][/*current*/ ctx[1]].title,
    				state: "open",
    				votes: /*$vList*/ ctx[2][/*current*/ ctx[1]].options
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*$vList, current*/ 6) card_changes.title = /*$vList*/ ctx[2][/*current*/ ctx[1]].title;
    			if (dirty & /*$vList, current*/ 6) card_changes.votes = /*$vList*/ ctx[2][/*current*/ ctx[1]].options;
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(21:30) ",
    		ctx
    	});

    	return block;
    }

    // (1:0) {#if mode === 'view'}
    function create_if_block(ctx) {
    	let h2;
    	let t1;
    	let button;
    	let t3;
    	let each_1_anchor;
    	let mounted;
    	let dispose;
    	let each_value = /*$vList*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Votações";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Nova votação";
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			add_location(h2, file, 1, 2, 24);
    			add_location(button, file, 2, 2, 44);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t3, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addVote*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*openVote, $vList, removeVote, editVote*/ 228) {
    				each_value = /*$vList*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t3);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(1:0) {#if mode === 'view'}",
    		ctx
    	});

    	return block;
    }

    // (14:10) {#if i < vote.options.length - 1}
    function create_if_block_1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "/";
    			add_location(span, file, 13, 44, 455);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(14:10) {#if i < vote.options.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (11:6) {#each vote.options as o, i}
    function create_each_block_1(ctx) {
    	let span;
    	let t0_value = /*o*/ ctx[16].text + "";
    	let t0;
    	let t1;
    	let if_block = /*i*/ ctx[18] < /*vote*/ ctx[13].options.length - 1 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			add_location(span, file, 11, 8, 383);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$vList*/ 4 && t0_value !== (t0_value = /*o*/ ctx[16].text + "")) set_data_dev(t0, t0_value);

    			if (/*i*/ ctx[18] < /*vote*/ ctx[13].options.length - 1) {
    				if (if_block) ; else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(11:6) {#each vote.options as o, i}",
    		ctx
    	});

    	return block;
    }

    // (4:2) {#each $vList as vote, index}
    function create_each_block(ctx) {
    	let p;
    	let b0;
    	let t1;
    	let t2_value = /*vote*/ ctx[13].title + "";
    	let t2;
    	let t3;
    	let button0;
    	let t5;
    	let button1;
    	let t7;
    	let br;
    	let t8;
    	let b1;
    	let t10;
    	let t11;
    	let button2;
    	let t13;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[10](/*index*/ ctx[15], ...args);
    	}

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[11](/*index*/ ctx[15], ...args);
    	}

    	let each_value_1 = /*vote*/ ctx[13].options;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[12](/*index*/ ctx[15], ...args);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			b0 = element("b");
    			b0.textContent = "P:";
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			button0 = element("button");
    			button0.textContent = "Edita";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "Remove";
    			t7 = space();
    			br = element("br");
    			t8 = space();
    			b1 = element("b");
    			b1.textContent = "R:";
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			button2 = element("button");
    			button2.textContent = "Abre a votação";
    			t13 = space();
    			add_location(b0, file, 5, 6, 139);
    			attr_dev(button0, "class", "m5");
    			add_location(button0, file, 6, 6, 171);
    			attr_dev(button1, "class", "m5");
    			add_location(button1, file, 7, 6, 242);
    			add_location(br, file, 8, 6, 316);
    			add_location(b1, file, 9, 6, 329);
    			attr_dev(button2, "class", "m5");
    			add_location(button2, file, 17, 6, 523);
    			add_location(p, file, 4, 4, 129);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, b0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, button0);
    			append_dev(p, t5);
    			append_dev(p, button1);
    			append_dev(p, t7);
    			append_dev(p, br);
    			append_dev(p, t8);
    			append_dev(p, b1);
    			append_dev(p, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(p, null);
    			}

    			append_dev(p, t11);
    			append_dev(p, button2);
    			append_dev(p, t13);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false),
    					listen_dev(button2, "click", click_handler_2, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$vList*/ 4 && t2_value !== (t2_value = /*vote*/ ctx[13].title + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*$vList*/ 4) {
    				each_value_1 = /*vote*/ ctx[13].options;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(p, t11);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(4:2) {#each $vList as vote, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*mode*/ ctx[0] === "view") return 0;
    		if (/*mode*/ ctx[0] === "voteCard") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $vList;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("List", slots, []);
    	let mode = "view";
    	let current = null;
    	let vList = createVoteList();
    	validate_store(vList, "vList");
    	component_subscribe($$self, vList, value => $$invalidate(2, $vList = value));

    	function addVote() {
    		$$invalidate(0, mode = "add");
    		vList.create();
    		$$invalidate(1, current = $vList.length - 1);
    	}

    	function openVote(index) {
    		$$invalidate(0, mode = "voteCard");
    		$$invalidate(1, current = index);
    	}

    	function editVote(index) {
    		$$invalidate(1, current = index);
    		$$invalidate(0, mode = "edit");
    	}

    	function removeVote(index) {
    		vList.remove(index);
    	}

    	function updateChanges({ detail }) {
    		vList.change(detail, current);
    		$$invalidate(0, mode = "view");
    	}

    	function cancelChanges() {
    		if (mode === "add") {
    			removeVote($vList.length - 1);
    		}

    		$$invalidate(0, mode = "view");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (index, e) => editVote(index);
    	const click_handler_1 = (index, e) => removeVote(index);
    	const click_handler_2 = (index, e) => openVote(index);

    	$$self.$capture_state = () => ({
    		voteList,
    		createVoteList,
    		Form,
    		Card,
    		mode,
    		current,
    		vList,
    		addVote,
    		openVote,
    		editVote,
    		removeVote,
    		updateChanges,
    		cancelChanges,
    		$vList
    	});

    	$$self.$inject_state = $$props => {
    		if ("mode" in $$props) $$invalidate(0, mode = $$props.mode);
    		if ("current" in $$props) $$invalidate(1, current = $$props.current);
    		if ("vList" in $$props) $$invalidate(3, vList = $$props.vList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		mode,
    		current,
    		$vList,
    		vList,
    		addVote,
    		openVote,
    		editVote,
    		removeVote,
    		updateChanges,
    		cancelChanges,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new List({
    	target: document.body,/*
    	props: {
    		title: title,
    		state: state,
    		votes: votes
    	}*/
    });

    /*
    import Card from './components/Card.svelte'

    var title = "Segue o relator?"
    var state = "open"
    var votes = [
    	{
    		option: 'Sim',
    		count: 8
    	},
    	{
    		option: 'Não',
    		count: 3
    	}
    ]

    const app = new Card({
    	target: document.body,
    	props: {
    		title: title,
    		state: state,
    		votes: votes
    	}
    });

    export default app;
    */

    return app;

}());
//# sourceMappingURL=bundle.js.map
