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
  Void: any;
};


export type Error = {
  __typename?: 'Error';
  message: Scalars['String'];
  path: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  _dummy?: Maybe<Scalars['Boolean']>;
  me?: Maybe<MeOutput>;
};

export type UserAccount = {
  __typename?: 'UserAccount';
  id: Scalars['ID'];
  email: Scalars['String'];
  profile?: Maybe<UserProfile>;
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

/** Gender Enum */
export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Na = 'NA',
  Other = 'OTHER'
}

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

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<LoginOutput>;
  logout?: Maybe<Scalars['Void']>;
  register?: Maybe<RegisterOutput>;
  saveProfile?: Maybe<UserProfileOutput>;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
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

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  Void: ResolverTypeWrapper<Scalars['Void']>;
  Error: ResolverTypeWrapper<Error>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  UserAccount: ResolverTypeWrapper<UserAccount>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  UserProfile: ResolverTypeWrapper<UserProfile>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Gender: Gender;
  RegisterOutput: ResolverTypeWrapper<RegisterOutput>;
  LoginOutput: ResolverTypeWrapper<LoginOutput>;
  MeOutput: ResolverTypeWrapper<MeOutput>;
  Mutation: ResolverTypeWrapper<{}>;
  UserProfileOutput: ResolverTypeWrapper<UserProfileOutput>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Void: Scalars['Void'];
  Error: Error;
  String: Scalars['String'];
  Query: {};
  Boolean: Scalars['Boolean'];
  UserAccount: UserAccount;
  ID: Scalars['ID'];
  UserProfile: UserProfile;
  Int: Scalars['Int'];
  RegisterOutput: RegisterOutput;
  LoginOutput: LoginOutput;
  MeOutput: MeOutput;
  Mutation: {};
  UserProfileOutput: UserProfileOutput;
};

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _dummy?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['MeOutput']>, ParentType, ContextType>;
};

export type UserAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAccount'] = ResolversParentTypes['UserAccount']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['UserProfile']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type UserProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserProfile'] = ResolversParentTypes['UserProfile']> = {
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['Gender'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type RegisterOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegisterOutput'] = ResolversParentTypes['RegisterOutput']> = {
  userAccount?: Resolver<Maybe<ResolversTypes['UserAccount']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type LoginOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginOutput'] = ResolversParentTypes['LoginOutput']> = {
  userAccount?: Resolver<Maybe<ResolversTypes['UserAccount']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MeOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeOutput'] = ResolversParentTypes['MeOutput']> = {
  userAccount?: Resolver<Maybe<ResolversTypes['UserAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  login?: Resolver<Maybe<ResolversTypes['LoginOutput']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType>;
  register?: Resolver<Maybe<ResolversTypes['RegisterOutput']>, ParentType, ContextType, RequireFields<MutationRegisterArgs, 'email' | 'password'>>;
  saveProfile?: Resolver<Maybe<ResolversTypes['UserProfileOutput']>, ParentType, ContextType, RequireFields<MutationSaveProfileArgs, 'firstName' | 'lastName' | 'gender'>>;
};

export type UserProfileOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserProfileOutput'] = ResolversParentTypes['UserProfileOutput']> = {
  userProfile?: Resolver<Maybe<ResolversTypes['UserProfile']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = any> = {
  Void?: GraphQLScalarType;
  Error?: ErrorResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UserAccount?: UserAccountResolvers<ContextType>;
  UserProfile?: UserProfileResolvers<ContextType>;
  RegisterOutput?: RegisterOutputResolvers<ContextType>;
  LoginOutput?: LoginOutputResolvers<ContextType>;
  MeOutput?: MeOutputResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  UserProfileOutput?: UserProfileOutputResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
