import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: Upload;
  Date: Date;
  DateTime: DateTime;
  Void: any;
};




/** Album Output */
export type AlbumOutput = {
  __typename?: 'AlbumOutput';
  /** Id */
  id: Scalars['Int'];
  /** Album Title */
  title: Scalars['String'];
  /** Album Description */
  description: Scalars['String'];
  /** Created At */
  createdAt: Scalars['DateTime'];
  /** Photos */
  photos?: Maybe<Array<Photo>>;
};

export type AddAlbumOutput = {
  __typename?: 'AddAlbumOutput';
  album?: Maybe<AlbumOutput>;
  errors?: Maybe<Array<Error>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAlbum?: Maybe<AddAlbumOutput>;
  avatarGetPreSignedUrl: S3GetPreSignedUrlResponse;
  avatarPutPreSignedUrl: S3PutPreSignedUrlResponse;
  login?: Maybe<LoginOutput>;
  logout?: Maybe<Scalars['Void']>;
  photoPutPreSignedUrl: S3PutPreSignedUrlResponse;
  register?: Maybe<RegisterOutput>;
  saveProfile?: Maybe<UserProfileOutput>;
};


export type MutationAddAlbumArgs = {
  title: Scalars['String'];
  description: Scalars['String'];
};


export type MutationAvatarGetPreSignedUrlArgs = {
  filename: Scalars['String'];
};


export type MutationAvatarPutPreSignedUrlArgs = {
  filename: Scalars['String'];
  filetype: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationPhotoPutPreSignedUrlArgs = {
  albumId: Scalars['Int'];
  filename: Scalars['String'];
  filetype: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSaveProfileArgs = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  gender: Gender;
};

export type GetAlbumOutput = {
  __typename?: 'GetAlbumOutput';
  album?: Maybe<AlbumOutput>;
  errors?: Maybe<Array<Error>>;
};

export type GetAlbumsOutput = {
  __typename?: 'GetAlbumsOutput';
  albums?: Maybe<Array<AlbumOutput>>;
  errors?: Maybe<Array<Error>>;
};

export type Query = {
  __typename?: 'Query';
  _dummy?: Maybe<Scalars['Boolean']>;
  getAlbum?: Maybe<GetAlbumOutput>;
  getAlbums?: Maybe<GetAlbumsOutput>;
  getUserProfile?: Maybe<UserProfileOutput>;
  me?: Maybe<MeOutput>;
};


export type QueryGetAlbumArgs = {
  id: Scalars['Int'];
};

export type S3PutPreSignedUrlResponse = {
  __typename?: 'S3PutPreSignedUrlResponse';
  filename: Scalars['String'];
  signedRequest: Scalars['String'];
  url: Scalars['String'];
};

export type S3GetPreSignedUrlResponse = {
  __typename?: 'S3GetPreSignedUrlResponse';
  signedRequest: Scalars['String'];
  url: Scalars['String'];
};

/** Gender Enum */
export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Na = 'NA',
  Other = 'OTHER'
}

/** Uploaded File Response */
export type UploadedFileResponse = {
  __typename?: 'UploadedFileResponse';
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
  url: Scalars['String'];
};

/** Photo */
export type Photo = {
  __typename?: 'Photo';
  /** File name */
  filename: Scalars['String'];
  /** Created at */
  createdAt: Scalars['DateTime'];
  /** Url */
  url: Scalars['String'];
};


export type Error = {
  __typename?: 'Error';
  message: Scalars['String'];
  path: Scalars['String'];
};

export type UserAccount = {
  __typename?: 'UserAccount';
  id: Scalars['ID'];
  email: Scalars['String'];
  profile?: Maybe<UserProfile>;
  photoUrl?: Maybe<Scalars['String']>;
};

/** User Profile */
export type UserProfile = {
  __typename?: 'UserProfile';
  /** First Name */
  firstName: Scalars['String'];
  /** Gender */
  gender: Gender;
  /** Id */
  id: Scalars['Int'];
  /** Last Name */
  lastName: Scalars['String'];
};

export type RegisterOutput = {
  __typename?: 'RegisterOutput';
  userAccount?: Maybe<UserAccount>;
  errors?: Maybe<Array<Error>>;
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  userAccount?: Maybe<UserAccount>;
  errors?: Maybe<Array<Error>>;
};

export type MeOutput = {
  __typename?: 'MeOutput';
  userAccount?: Maybe<UserAccount>;
};

export type UserProfileOutput = {
  __typename?: 'UserProfileOutput';
  userProfile?: Maybe<UserProfile>;
  errors?: Maybe<Array<Error>>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  AlbumOutput: ResolverTypeWrapper<AlbumOutput>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  AddAlbumOutput: ResolverTypeWrapper<AddAlbumOutput>;
  Mutation: ResolverTypeWrapper<{}>;
  GetAlbumOutput: ResolverTypeWrapper<GetAlbumOutput>;
  GetAlbumsOutput: ResolverTypeWrapper<GetAlbumsOutput>;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  S3PutPreSignedUrlResponse: ResolverTypeWrapper<S3PutPreSignedUrlResponse>;
  S3GetPreSignedUrlResponse: ResolverTypeWrapper<S3GetPreSignedUrlResponse>;
  Gender: Gender;
  UploadedFileResponse: ResolverTypeWrapper<UploadedFileResponse>;
  Photo: ResolverTypeWrapper<Photo>;
  Void: ResolverTypeWrapper<Scalars['Void']>;
  Error: ResolverTypeWrapper<Error>;
  UserAccount: ResolverTypeWrapper<UserAccount>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  UserProfile: ResolverTypeWrapper<UserProfile>;
  RegisterOutput: ResolverTypeWrapper<RegisterOutput>;
  LoginOutput: ResolverTypeWrapper<LoginOutput>;
  MeOutput: ResolverTypeWrapper<MeOutput>;
  UserProfileOutput: ResolverTypeWrapper<UserProfileOutput>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Upload: Scalars['Upload'];
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  AlbumOutput: AlbumOutput;
  Int: Scalars['Int'];
  String: Scalars['String'];
  AddAlbumOutput: AddAlbumOutput;
  Mutation: {};
  GetAlbumOutput: GetAlbumOutput;
  GetAlbumsOutput: GetAlbumsOutput;
  Query: {};
  Boolean: Scalars['Boolean'];
  S3PutPreSignedUrlResponse: S3PutPreSignedUrlResponse;
  S3GetPreSignedUrlResponse: S3GetPreSignedUrlResponse;
  UploadedFileResponse: UploadedFileResponse;
  Photo: Photo;
  Void: Scalars['Void'];
  Error: Error;
  UserAccount: UserAccount;
  ID: Scalars['ID'];
  UserProfile: UserProfile;
  RegisterOutput: RegisterOutput;
  LoginOutput: LoginOutput;
  MeOutput: MeOutput;
  UserProfileOutput: UserProfileOutput;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type AlbumOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['AlbumOutput'] = ResolversParentTypes['AlbumOutput']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  photos?: Resolver<Maybe<Array<ResolversTypes['Photo']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AddAlbumOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddAlbumOutput'] = ResolversParentTypes['AddAlbumOutput']> = {
  album?: Resolver<Maybe<ResolversTypes['AlbumOutput']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addAlbum?: Resolver<Maybe<ResolversTypes['AddAlbumOutput']>, ParentType, ContextType, RequireFields<MutationAddAlbumArgs, 'title' | 'description'>>;
  avatarGetPreSignedUrl?: Resolver<ResolversTypes['S3GetPreSignedUrlResponse'], ParentType, ContextType, RequireFields<MutationAvatarGetPreSignedUrlArgs, 'filename'>>;
  avatarPutPreSignedUrl?: Resolver<ResolversTypes['S3PutPreSignedUrlResponse'], ParentType, ContextType, RequireFields<MutationAvatarPutPreSignedUrlArgs, 'filename' | 'filetype'>>;
  login?: Resolver<Maybe<ResolversTypes['LoginOutput']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType>;
  photoPutPreSignedUrl?: Resolver<ResolversTypes['S3PutPreSignedUrlResponse'], ParentType, ContextType, RequireFields<MutationPhotoPutPreSignedUrlArgs, 'albumId' | 'filename' | 'filetype'>>;
  register?: Resolver<Maybe<ResolversTypes['RegisterOutput']>, ParentType, ContextType, RequireFields<MutationRegisterArgs, 'email' | 'password'>>;
  saveProfile?: Resolver<Maybe<ResolversTypes['UserProfileOutput']>, ParentType, ContextType, RequireFields<MutationSaveProfileArgs, 'firstName' | 'lastName' | 'gender'>>;
};

export type GetAlbumOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetAlbumOutput'] = ResolversParentTypes['GetAlbumOutput']> = {
  album?: Resolver<Maybe<ResolversTypes['AlbumOutput']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetAlbumsOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetAlbumsOutput'] = ResolversParentTypes['GetAlbumsOutput']> = {
  albums?: Resolver<Maybe<Array<ResolversTypes['AlbumOutput']>>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _dummy?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  getAlbum?: Resolver<Maybe<ResolversTypes['GetAlbumOutput']>, ParentType, ContextType, RequireFields<QueryGetAlbumArgs, 'id'>>;
  getAlbums?: Resolver<Maybe<ResolversTypes['GetAlbumsOutput']>, ParentType, ContextType>;
  getUserProfile?: Resolver<Maybe<ResolversTypes['UserProfileOutput']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['MeOutput']>, ParentType, ContextType>;
};

export type S3PutPreSignedUrlResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['S3PutPreSignedUrlResponse'] = ResolversParentTypes['S3PutPreSignedUrlResponse']> = {
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  signedRequest?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type S3GetPreSignedUrlResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['S3GetPreSignedUrlResponse'] = ResolversParentTypes['S3GetPreSignedUrlResponse']> = {
  signedRequest?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UploadedFileResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadedFileResponse'] = ResolversParentTypes['UploadedFileResponse']> = {
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimetype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  encoding?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PhotoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Photo'] = ResolversParentTypes['Photo']> = {
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAccount'] = ResolversParentTypes['UserAccount']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['UserProfile']>, ParentType, ContextType>;
  photoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserProfile'] = ResolversParentTypes['UserProfile']> = {
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['Gender'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegisterOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegisterOutput'] = ResolversParentTypes['RegisterOutput']> = {
  userAccount?: Resolver<Maybe<ResolversTypes['UserAccount']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginOutput'] = ResolversParentTypes['LoginOutput']> = {
  userAccount?: Resolver<Maybe<ResolversTypes['UserAccount']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeOutput'] = ResolversParentTypes['MeOutput']> = {
  userAccount?: Resolver<Maybe<ResolversTypes['UserAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserProfileOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserProfileOutput'] = ResolversParentTypes['UserProfileOutput']> = {
  userProfile?: Resolver<Maybe<ResolversTypes['UserProfile']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Upload?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  AlbumOutput?: AlbumOutputResolvers<ContextType>;
  AddAlbumOutput?: AddAlbumOutputResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  GetAlbumOutput?: GetAlbumOutputResolvers<ContextType>;
  GetAlbumsOutput?: GetAlbumsOutputResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  S3PutPreSignedUrlResponse?: S3PutPreSignedUrlResponseResolvers<ContextType>;
  S3GetPreSignedUrlResponse?: S3GetPreSignedUrlResponseResolvers<ContextType>;
  UploadedFileResponse?: UploadedFileResponseResolvers<ContextType>;
  Photo?: PhotoResolvers<ContextType>;
  Void?: GraphQLScalarType;
  Error?: ErrorResolvers<ContextType>;
  UserAccount?: UserAccountResolvers<ContextType>;
  UserProfile?: UserProfileResolvers<ContextType>;
  RegisterOutput?: RegisterOutputResolvers<ContextType>;
  LoginOutput?: LoginOutputResolvers<ContextType>;
  MeOutput?: MeOutputResolvers<ContextType>;
  UserProfileOutput?: UserProfileOutputResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
