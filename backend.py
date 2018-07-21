import data
import create_index
import sort

def backend():
	messages = data.get()
	index = create_index.create_index(messages)
	output = sort.sort(*index)
	return output

if __name__ == "__main__":
	output = backend()
	import pdb
	pdb.set_trace()

