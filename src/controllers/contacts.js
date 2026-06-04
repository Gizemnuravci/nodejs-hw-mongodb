import createError from 'http-errors';
import * as contactServices from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../services/cloudinary.js';
export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = req.query;
  const filter = parseFilterParams(req.query);

  const userId = req.user._id;

  const contactsData = await contactServices.getAllContacts({
    page,
    perPage,
    sortBy: sortBy || 'name',
    sortOrder: sortOrder || 'asc',
    filter,
    userId,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await contactServices.getContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  let photoUrl = null;

  if (req.file) {
    photoUrl = await uploadToCloudinary(req.file.path);
  }

  const contact = await contactServices.createContact(
    req.body,
    userId,
    photoUrl,
  );

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  let photoUrl = null;

  if (req.file) {
    photoUrl = await uploadToCloudinary(req.file.path);
  }

  const contact = await contactServices.updateContact(
    contactId,
    req.body,
    userId,
    photoUrl,
  );

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await contactServices.deleteContact(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
