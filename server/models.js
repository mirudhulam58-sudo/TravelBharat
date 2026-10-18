const m = require('mongoose');
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const stateSchema = new m.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  type: { type: String, enum: ['State', 'UT'], default: 'State' },
});
stateSchema.pre('validate', function () { if (!this.slug) this.slug = slugify(this.name); });

const placeSchema = new m.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  state: { type: m.Schema.Types.ObjectId, ref: 'State', required: true },
  city: { type: String, required: true },
  category: { type: String, enum: ['Heritage', 'Nature', 'Adventure', 'Religious'], required: true },
  description: String, history: String, bestTime: String,
  entryFee: String, timings: String, mapLink: String,
  images: [String], nearby: [String],
}, { timestamps: true });
placeSchema.pre('validate', function () { if (!this.slug) this.slug = slugify(this.name); });

module.exports = { State: m.model('State', stateSchema), Place: m.model('Place', placeSchema) };
