# syntez
A framework for declarative programming. Build applications as a hierarchy of interdependent objects.

Your application is synthesized into a single self-updating graph using built-in JavaScript capabilities.
There are no artificial reactivity layers. Instead, reactivity emerges implicitly through object property definitions—implemented as functions—that are recalculated whenever the results of calls within those functions change.

Key concepts:
 - Implicit graph construction: a dependency map is generated automatically when an object method is called; methods are pure functions that must return the value of the corresponding property—essentially, every method acts as a getter.
 - Built-in mutability: directly modifying a root property triggers a synchronous, cascading update across all dependent branches.
 - Seamless integration: a unified architecture that combines local state, UI components, and server data into a single object hierarchy.


Usage Examples

<script src="/syntez.js">
<script>
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
</script>
