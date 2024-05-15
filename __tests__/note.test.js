describe('Basic user flow for Website', () => {
    // First, visit the lab 8 website
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5500/');
  });

  // Next, check if add new note works
  it('Check add new note and edit new note', async () => {
    const add_note = await page.$('.add-note');

    // adding 3 new notes and putting text into them
    for (let i = 0; i < 3; i++) {
        await add_note.click();
        let notes = await page.$$('.note');
        await notes[i].type(`new note ${i + 1}`);
        await page.keyboard.press('Tab');
    }

    // test to see if the wanted results are present
    for (let i = 0; i < 3; i++) {
        const notes = await page.$$('.note');
        expect(notes.length).toBe(3);

        const noteText = await (await notes[i].getProperty('value')).jsonValue();
        expect(noteText).toBe(`new note ${i + 1}`);
    }
  },10000);

  // Edit existing note (edited note is saved by clicking outside of the note, or pressing tab- a focused note cannot be deleted or saved)
  it('Edit an existing note', async () => {
    const notes = await page.$$('.note');

    // editting text in existing notes
    for (let i = 0; i < notes.length; i++) {
        await notes[i].type(` existing`);
        await page.keyboard.press('Tab');
    }

    // test to see if the wanted results are present
    for (let i = 0; i < notes.length; i++) {
        const noteText = await (await notes[i].getProperty('value')).jsonValue();
        expect(noteText).toBe(`new note ${i + 1} existing`);
    }
  },10000);

  // Notes are saved locally (notes are still there after refreshing page)
  it('Check if notes are saved', async () => {
    await page.reload();

    const notes = await page.$$('.note');

    // test to see if the notes saved
    for (let i = 0; i < notes.length; i++) {
        const noteText = await (await notes[i].getProperty('value')).jsonValue();
        expect(noteText).toBe(`new note ${i + 1} existing`);
    }
    
  },10000);

  // Delete note by double clicking on note
  it('Check if note is deleted with double click', async () => {
    let note = await page.$('.note');
    await note.click({clickCount: 2});
    let notes = await page.$$('.note');
    expect(notes.length).toBe(2);
  });
})