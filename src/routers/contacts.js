import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import * as contactsControllers from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/upload.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

const router = Router();

router.use(authenticate);

router.get('/contacts', ctrlWrapper(contactsControllers.getContactsController));

router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(contactsControllers.getContactByIdController),
);

router.post(
  '/contacts',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(contactsControllers.createContactController),
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(contactsControllers.patchContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(contactsControllers.deleteContactController),
);

export default router;
