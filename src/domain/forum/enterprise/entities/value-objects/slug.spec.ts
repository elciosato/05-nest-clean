import { Slug } from './slug'

test('should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('An example  of the title-')

  expect(slug.value).toEqual('an-example-of-the-title')
})
