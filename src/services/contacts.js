import { Contact } from '../db/models/contact.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const queryFilter = { ...filter, userId };

  const totalItems = await Contact.countDocuments(queryFilter);

  const contacts = await Contact.find(queryFilter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(perPage);

  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload, userId) => {
  const newContact = await Contact.create({ ...payload, userId });
  return newContact;
};

export const updateContact = async (contactId, payload, userId) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true, runValidators: true },
  );
  return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
  const deletedContact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return deletedContact;
};
