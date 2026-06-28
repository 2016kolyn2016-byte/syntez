# syntez
A framework for declarative programming. Build applications as a hierarchy of interdependent objects.

Your application is synthesized into a single, self-computing graph using built-in JavaScript capabilities.
There are no artificial reactivity layers; instead, reactivity emerges implicitly through object definitions and is maintained via native getters.

Key Concepts:
 - Implicit Graph Construction: A dependency map is automatically generated when an object property getter is called
 - Native Mutability: Directly modifying a root property triggers a synchronous, cascading update across all dependent branches
 - Seamless Integration: A unified architecture that integrates local state, UI components, and server data into a single object hierarchy.

Usage Examples

syntez({
	html: {
		head: [{tag: 'meta', charset: 'utf-8'}],
		body: [
			{tag: 'header', body: 'Header'},
			{tag: 'main', body: () => {
				var name = syntez.in('Anonim');
				return [
					name,
					{data: () => name.data()}
				]
			}},
			{tag: 'aside', body: 1},
			{tag: 'footer', body: {tag: 'span', data: 2}}
		]
	}
})
