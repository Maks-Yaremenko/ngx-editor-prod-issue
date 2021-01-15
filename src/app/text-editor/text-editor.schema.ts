import { nodes, marks } from 'ngx-editor';
import { Schema } from 'prosemirror-model';

const schema = new Schema({
  nodes,
  marks,
});

export default schema;
